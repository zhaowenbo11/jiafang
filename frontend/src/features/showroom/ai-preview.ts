import { readFile } from "node:fs/promises";
import path from "node:path";
import type {
  FabricLibraryItem,
  GeneratedPreview,
  PreviewImageInputs,
  PreviewTemplateType,
} from "./types";

type GeneratePreviewInput = {
  businessId: string;
  fabric: FabricLibraryItem;
  templateType: PreviewTemplateType;
  templateName: string;
  prompt: string;
  imageInputs?: PreviewImageInputs;
};

type FluxCreateResponse = {
  id?: string;
  polling_url?: string;
  status?: string;
  result?: {
    sample?: string;
  };
  sample?: string;
  error?: string;
};

type FluxPollResponse = {
  status?: string;
  result?: {
    sample?: string;
  };
  error?: string;
};

type FluxModelFamily = "flux-kontext" | "flux-2";

function buildMockPreview(
  fabric: FabricLibraryItem,
  prompt: string
): GeneratedPreview {
  return {
    imageUrl:
      fabric.imageUrl ||
      `https://placehold.co/1200x900/${fabric.swatch.replace("#", "")}/${fabric.detailSwatch.replace("#", "")}?text=${encodeURIComponent(fabric.name)}`,
    prompt,
    provider: "mock",
    generatedAt: new Date().toISOString(),
  };
}

function trimTrailingSlash(input: string) {
  return input.replace(/\/+$/, "");
}

function resolveFluxModelFamily(model: string): FluxModelFamily {
  return model.startsWith("flux-2") ? "flux-2" : "flux-kontext";
}

function resolveFluxEndpoint(baseUrl: string, model: string) {
  const normalizedBaseUrl = trimTrailingSlash(baseUrl);
  const override =
    process.env.BFL_FLUX_ENDPOINT?.trim() || process.env.KL_FLUX_ENDPOINT?.trim();

  if (override) {
    if (/^https?:\/\//i.test(override)) {
      return override;
    }

    return `${normalizedBaseUrl}/${override.replace(/^\/+/, "")}`;
  }

  if (resolveFluxModelFamily(model) === "flux-2") {
    return `${normalizedBaseUrl}/${model}`;
  }

  return `${normalizedBaseUrl}/flux-kontext-pro`;
}

function resolveAspectRatio(templateType: PreviewTemplateType) {
  if (templateType === "scene") return "16:9";
  if (templateType === "detail") return "1:1";
  return "4:3";
}

function resolveMimeType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function normalizeImageInput(imagePathOrUrl?: string) {
  if (!imagePathOrUrl) return null;

  if (/^data:/i.test(imagePathOrUrl) || /^https?:\/\//i.test(imagePathOrUrl)) {
    return imagePathOrUrl;
  }

  if (!imagePathOrUrl.startsWith("/")) {
    return null;
  }

  const absolutePath = path.join(
    process.cwd(),
    "public",
    imagePathOrUrl.replace(/^\/+/, "")
  );
  const fileBuffer = await readFile(absolutePath);
  const mimeType = resolveMimeType(absolutePath);

  return `data:${mimeType};base64,${fileBuffer.toString("base64")}`;
}

function buildFluxPrompt(input: GeneratePreviewInput, modelFamily: FluxModelFamily) {
  const realFabricNotes = [
    "Use the template image as the composition base.",
    "Keep the bedding layout, camera angle, furniture position, and room structure consistent with the template.",
    "The final bedding must match the selected fabric as closely as possible in color, sheen, weave, floral pattern, and tactile texture.",
    "Do not invent unrelated patterns, embroidery, logos, or decorative motifs.",
    "The result must look like a realistic bedding product photo for an in-store sales presentation.",
  ];

  if (modelFamily === "flux-kontext") {
    realFabricNotes.push(
      "This request uses a single main edit image, so preserve the template scene and apply the selected fabric characteristics conservatively."
    );
  } else {
    realFabricNotes.push(
      "Use the extra reference images to preserve the fabric's real pattern and close-up texture details."
    );
  }

  return [input.prompt, ...realFabricNotes].join("\n");
}

async function buildFluxRequestBody(
  input: GeneratePreviewInput,
  model: string
) {
  const modelFamily = resolveFluxModelFamily(model);
  const templateBaseImage = await normalizeImageInput(
    input.imageInputs?.templateBaseImageUrl
  );
  const fabricImage = await normalizeImageInput(input.imageInputs?.fabricImageUrl);
  const fabricDetailImage = await normalizeImageInput(
    input.imageInputs?.fabricDetailImageUrl
  );
  const inputImage = templateBaseImage ?? fabricImage ?? fabricDetailImage;

  if (!inputImage) {
    return null;
  }

  const payload: Record<string, string | boolean | number> = {
    prompt: buildFluxPrompt(input, modelFamily),
    input_image: inputImage,
    aspect_ratio: resolveAspectRatio(input.templateType),
    output_format: "png",
    prompt_upsampling: false,
    safety_tolerance: 2,
  };

  if (modelFamily === "flux-2") {
    if (fabricImage && fabricImage !== inputImage) {
      payload.input_image_2 = fabricImage;
    }

    if (
      fabricDetailImage &&
      fabricDetailImage !== inputImage &&
      fabricDetailImage !== fabricImage
    ) {
      payload.input_image_3 = fabricDetailImage;
    }
  }

  return payload;
}

function buildAuthHeaders(apiKey: string) {
  return {
    accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "x-key": apiKey,
  };
}

function tryParseJson<T>(rawText: string): T | null {
  try {
    return JSON.parse(rawText) as T;
  } catch {
    return null;
  }
}

function resolvePollingUrl(baseUrl: string, pollingUrl: string) {
  if (/^https?:\/\//i.test(pollingUrl)) {
    return pollingUrl;
  }

  return `${trimTrailingSlash(baseUrl)}/${pollingUrl.replace(/^\/+/, "")}`;
}

async function pollFluxResult(
  pollingUrl: string,
  apiKey: string,
  timeoutMs: number
) {
  const startedAt = Date.now();
  const pollIntervalMs = Number(
    process.env.BFL_FLUX_POLL_INTERVAL_MS ||
      process.env.KL_FLUX_POLL_INTERVAL_MS ||
      500
  );
  let lastResponseText = "";
  let lastStatusCode: number | undefined;

  while (Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

    const response = await fetch(pollingUrl, {
      method: "GET",
      headers: buildAuthHeaders(apiKey),
    });

    lastStatusCode = response.status;
    lastResponseText = await response.text();
    const result = tryParseJson<FluxPollResponse>(lastResponseText);
    const status = result?.status;

    if (status === "Ready" && result?.result?.sample) {
      return {
        imageUrl: result.result.sample,
        responseSnippet: lastResponseText.slice(0, 800),
        statusCode: lastStatusCode,
      };
    }

    if (status === "Failed" || status === "Error") {
      return {
        errorMessage: result?.error || "FLUX polling reported a failed status.",
        responseSnippet: lastResponseText.slice(0, 800),
        statusCode: lastStatusCode,
      };
    }
  }

  return {
    errorMessage: `FLUX polling timed out after ${timeoutMs}ms.`,
    responseSnippet: lastResponseText.slice(0, 800),
    statusCode: lastStatusCode,
  };
}

async function generatePreviewWithFlux(
  input: GeneratePreviewInput
): Promise<GeneratedPreview> {
  const baseUrl =
    process.env.BFL_API_BASE_URL ||
    process.env.KL_API_BASE_URL ||
    "https://api.bfl.ai/v1";
  const apiKey = process.env.BFL_API_KEY || process.env.KL_API_KEY;
  const model =
    process.env.BFL_IMAGE_MODEL ||
    process.env.KL_IMAGE_MODEL ||
    "flux-2-pro-preview";
  const endpoint = resolveFluxEndpoint(baseUrl, model);
  const timeoutMs = Number(
    process.env.BFL_FLUX_TIMEOUT_MS ||
      process.env.KL_FLUX_TIMEOUT_MS ||
      45000
  );

  if (!apiKey) {
    return {
      ...buildMockPreview(input.fabric, input.prompt),
      debug: {
        mode: "fallback",
        endpoint,
        model,
        message: "Missing BFL_API_KEY, fallback to mock preview.",
      },
    };
  }

  const payload = await buildFluxRequestBody(input, model);

  if (!payload) {
    return {
      ...buildMockPreview(input.fabric, input.prompt),
      debug: {
        mode: "fallback",
        endpoint,
        model,
        message: "Missing template or fabric image input for FLUX request.",
      },
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: buildAuthHeaders(apiKey),
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    const createResult = tryParseJson<FluxCreateResponse>(rawText);

    if (!response.ok) {
      return {
        ...buildMockPreview(input.fabric, input.prompt),
        debug: {
          mode: "fallback",
          status: response.status,
          endpoint,
          model,
          responseSnippet: rawText.slice(0, 800),
          message: "FLUX create request returned non-2xx response.",
        },
      };
    }

    if (createResult?.result?.sample || createResult?.sample) {
      return {
        imageUrl: createResult.result?.sample || createResult.sample || "",
        prompt: payload.prompt as string,
        provider: "flux",
        generatedAt: new Date().toISOString(),
        debug: {
          mode: "real",
          status: response.status,
          endpoint,
          model,
          responseSnippet: rawText.slice(0, 800),
          message: "FLUX returned an image in the create response.",
        },
      };
    }

    if (!createResult?.polling_url) {
      return {
        ...buildMockPreview(input.fabric, input.prompt),
        debug: {
          mode: "fallback",
          status: response.status,
          endpoint,
          model,
          responseSnippet: rawText.slice(0, 800),
          message: "FLUX response did not contain polling_url.",
        },
      };
    }

    const pollResult = await pollFluxResult(
      resolvePollingUrl(baseUrl, createResult.polling_url),
      apiKey,
      timeoutMs
    );

    if (pollResult.imageUrl) {
      return {
        imageUrl: pollResult.imageUrl,
        prompt: payload.prompt as string,
        provider: "flux",
        generatedAt: new Date().toISOString(),
        debug: {
          mode: "real",
          status: pollResult.statusCode,
          endpoint,
          model,
          responseSnippet: pollResult.responseSnippet,
          message: "FLUX image generated successfully after polling.",
        },
      };
    }

    return {
      ...buildMockPreview(input.fabric, input.prompt),
      debug: {
        mode: "fallback",
        status: pollResult.statusCode,
        endpoint,
        model,
        responseSnippet: pollResult.responseSnippet,
        message: pollResult.errorMessage,
      },
    };
  } catch (error) {
    return {
      ...buildMockPreview(input.fabric, input.prompt),
      debug: {
        mode: "fallback",
        endpoint,
        model,
        message:
          error instanceof Error
            ? `FLUX request failed: ${error.message}`
            : "FLUX request failed before a valid response was parsed.",
      },
    };
  }
}

export async function generatePreviewWithFallback(
  input: GeneratePreviewInput
): Promise<GeneratedPreview> {
  const configuredProvider = (
    process.env.BFL_IMAGE_PROVIDER ||
    process.env.KL_IMAGE_PROVIDER ||
    "flux"
  ).trim();

  if (configuredProvider === "flux") {
    return generatePreviewWithFlux(input);
  }

  return {
    ...buildMockPreview(input.fabric, input.prompt),
    debug: {
      mode: "fallback",
      model:
        process.env.BFL_IMAGE_MODEL || process.env.KL_IMAGE_MODEL || "mock",
      message: `Unsupported image provider: ${configuredProvider}`,
    },
  };
}
