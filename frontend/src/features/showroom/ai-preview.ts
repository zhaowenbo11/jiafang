import { readFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import type {
  FabricLibraryItem,
  GeneratedPreview,
  PreviewAiRequestParams,
  PreviewImageInputs,
  PreviewTemplateType,
} from "./types";

type GeneratePreviewInput = {
  businessId: string;
  fabric: FabricLibraryItem;
  templateType: PreviewTemplateType;
  templateName: string;
  prompt: string;
  aiRequest: PreviewAiRequestParams;
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

type JimengSubmitResponse = {
  code?: number;
  message?: string;
  data?: {
    task_id?: string;
  };
};

type JimengResultResponse = {
  code?: number;
  status?: number;
  message?: string;
  request_id?: string;
  time_elapsed?: string;
  data?: {
    status?: "in_queue" | "generating" | "done" | "failed";
    image_urls?: string[];
    resp_data?: Array<{
      image_url?: string;
    }>;
    reason?: string;
  };
};

function buildMockPreview(
  fabric: FabricLibraryItem,
  prompt: string,
  provider: GeneratedPreview["provider"] = "mock"
): GeneratedPreview {
  return {
    imageUrl:
      fabric.imageUrl ||
      `https://placehold.co/1200x900/${fabric.swatch.replace("#", "")}/${fabric.detailSwatch.replace("#", "")}?text=${encodeURIComponent(fabric.name)}`,
    prompt,
    provider,
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
    input.aiRequest.systemPrompt,
    `Required replacement regions: ${input.aiRequest.constraints.replaceRegions.join(", ")}`,
    "Use the template image as the composition base.",
    "Keep the bedding layout, camera angle, furniture position, and room structure consistent with the template.",
    "The final bedding must match the selected fabric as closely as possible in color, sheen, weave, floral pattern, and tactile texture.",
    "Do not invent unrelated patterns, embroidery, logos, or decorative motifs.",
    "The result must look like a realistic bedding product photo for an in-store sales presentation.",
    `Negative constraints: ${input.aiRequest.negativePrompt}`,
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

  return [input.aiRequest.userPrompt, ...realFabricNotes].join("\n");
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
    aspect_ratio: input.aiRequest.aspectRatio || resolveAspectRatio(input.templateType),
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

function hmacSha256(
  key: string | Buffer,
  value: string,
  encoding?: crypto.BinaryToTextEncoding
) {
  const hmac = crypto.createHmac("sha256", key).update(value, "utf8");
  return encoding ? hmac.digest(encoding) : hmac.digest();
}

function sha256Hex(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function toAmzDate(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function signVolcRequest({
  method,
  host,
  path,
  query,
  body,
  accessKeyId,
  secretAccessKey,
  region,
  service,
}: {
  method: string;
  host: string;
  path: string;
  query: string;
  body: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  service: string;
}) {
  const now = new Date();
  const amzDate = toAmzDate(now);
  const shortDate = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(body);
  const canonicalHeaders = `content-type:application/json\nhost:${host}\nx-content-sha256:${payloadHash}\nx-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-content-sha256;x-date";
  const canonicalRequest = [
    method,
    path,
    query,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const credentialScope = `${shortDate}/${region}/${service}/request`;
  const stringToSign = [
    "HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const kDate = hmacSha256(secretAccessKey, shortDate);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, service);
  const kSigning = hmacSha256(kService, "request");
  const signature = hmacSha256(kSigning, stringToSign, "hex");

  return {
    headers: {
      "content-type": "application/json",
      host,
      "x-date": amzDate,
      "x-content-sha256": payloadHash,
      authorization: `HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
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
    input.aiRequest.model ||
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

async function buildJimengImages(input: GeneratePreviewInput) {
  const templateBaseImageUrl = input.imageInputs?.templateBaseImageUrl;
  const fabricImageUrl = input.imageInputs?.fabricImageUrl;
  const fabricDetailImageUrl = input.imageInputs?.fabricDetailImageUrl;

  const templateBaseImage = await normalizeImageInput(templateBaseImageUrl);
  const fabricImage = await normalizeImageInput(fabricImageUrl);
  const fabricDetailImage = await normalizeImageInput(fabricDetailImageUrl);

  return {
    templateBaseImageUrl,
    fabricImageUrl,
    fabricDetailImageUrl,
    templateBaseImage,
    fabricImage,
    fabricDetailImage,
  };
}

function resolveImageSize(size: string) {
  const match = size.match(/^(\d+)\s*[x*]\s*(\d+)$/i);

  if (!match) {
    return {
      width: 1536,
      height: 1152,
    };
  }

  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
}

function isRemoteHttpUrl(value?: string | null) {
  return Boolean(value && /^https?:\/\//i.test(value));
}

async function pollJimengResult({
  host,
  accessKeyId,
  secretAccessKey,
  region,
  service,
  reqKey,
  taskId,
  timeoutMs,
  pollIntervalMs,
}: {
  host: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  service: string;
  reqKey: string;
  taskId: string;
  timeoutMs: number;
  pollIntervalMs: number;
}) {
  const startedAt = Date.now();
  const pathName = "/";
  const query = "Action=CVSync2AsyncGetResult&Version=2022-08-31";
  let lastResponseText = "";
  let lastStatusCode: number | undefined;
  const pollingEndpoint = `https://${host}/?${query}`;
  const reqJson = JSON.stringify({
    return_url: true,
  });

  while (Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

    const body = JSON.stringify({
      req_key: reqKey,
      task_id: taskId,
      req_json: reqJson,
    });
    const signed = signVolcRequest({
      method: "POST",
      host,
      path: pathName,
      query,
      body,
      accessKeyId,
      secretAccessKey,
      region,
      service,
    });

    const response = await fetch(`https://${host}/?${query}`, {
      method: "POST",
      headers: signed.headers,
      body,
    });

    lastStatusCode = response.status;
    lastResponseText = await response.text();
    const result = tryParseJson<JimengResultResponse>(lastResponseText);
    const status = result?.data?.status;
    const imageUrl =
      result?.data?.image_urls?.[0] || result?.data?.resp_data?.[0]?.image_url;

    if (result?.code && result.code !== 10000) {
      return {
        errorMessage:
          result?.message ||
          `Jimeng query returned error code ${result.code}.`,
        responseSnippet: lastResponseText.slice(0, 800),
        statusCode: result?.status || lastStatusCode,
        endpoint: pollingEndpoint,
      };
    }

    if (status === "done" && imageUrl) {
      return {
        imageUrl,
        responseSnippet: lastResponseText.slice(0, 800),
        statusCode: lastStatusCode,
        endpoint: pollingEndpoint,
      };
    }

    if (status === "failed") {
      return {
        errorMessage: result?.data?.reason || result?.message || "Jimeng task failed.",
        responseSnippet: lastResponseText.slice(0, 800),
        statusCode: lastStatusCode,
        endpoint: pollingEndpoint,
      };
    }
  }

  return {
    errorMessage: `Jimeng polling timed out after ${timeoutMs}ms.`,
    responseSnippet: lastResponseText.slice(0, 800),
    statusCode: lastStatusCode,
    endpoint: pollingEndpoint,
  };
}

async function generatePreviewWithJimeng(
  input: GeneratePreviewInput
): Promise<GeneratedPreview> {
  const host = process.env.JIMENG_API_HOST || "visual.volcengineapi.com";
  const accessKeyId = process.env.JIMENG_AK;
  const secretAccessKey = process.env.JIMENG_SK;
  const reqKey =
    process.env.JIMENG_REQ_KEY ||
    input.aiRequest.model ||
    "jimeng_seedream46_cvtob";
  const region = process.env.JIMENG_REGION || "cn-north-1";
  const service = process.env.JIMENG_SERVICE || "cv";
  const timeoutMs = Number(process.env.JIMENG_TIMEOUT_MS || 60000);
  const pollIntervalMs = Number(process.env.JIMENG_POLL_INTERVAL_MS || 1500);

  if (!accessKeyId || !secretAccessKey) {
    return {
      ...buildMockPreview(input.fabric, input.prompt, "jimeng"),
      debug: {
        mode: "fallback",
        endpoint: `https://${host}`,
        model: reqKey,
        message: "Missing JIMENG_AK or JIMENG_SK, fallback to mock preview.",
      },
    };
  }

  const {
    templateBaseImageUrl,
    fabricImageUrl,
    fabricDetailImageUrl,
  } =
    await buildJimengImages(input);
  const { width, height } = resolveImageSize(input.aiRequest.size);
  const imageUrls = [
    templateBaseImageUrl,
    fabricImageUrl,
    fabricDetailImageUrl,
  ].filter((value): value is string => isRemoteHttpUrl(value));
  const localImagePaths = [
    templateBaseImageUrl,
    fabricImageUrl,
    fabricDetailImageUrl,
  ].filter((value): value is string => Boolean(value && !isRemoteHttpUrl(value)));
  const inputMode = imageUrls.length > 0 ? "image_urls" : "unknown";

  if (imageUrls.length === 0) {
    return {
      ...buildMockPreview(input.fabric, input.prompt, "jimeng"),
      debug: {
        mode: "fallback",
        endpoint: `https://${host}`,
        model: reqKey,
        message:
          "Jimeng 4.6 currently requires public image URLs. Upload template and fabric images to OSS/CDN and retry.",
        meta: {
          reqKey,
          inputMode,
          imageCount: imageUrls.length,
          size: input.aiRequest.size,
          width,
          height,
          usedImageUrls: imageUrls,
          localImagePaths,
          },
        },
      };
  }

  const body = JSON.stringify({
    req_key: reqKey,
    prompt: input.aiRequest.prompt,
    width,
    height,
    scale: 50,
    force_single: true,
    image_urls: imageUrls,
  });
  const query = "Action=CVSync2AsyncSubmitTask&Version=2022-08-31";
  const signed = signVolcRequest({
    method: "POST",
    host,
    path: "/",
    query,
    body,
    accessKeyId,
    secretAccessKey,
    region,
    service,
  });

  try {
    const response = await fetch(`https://${host}/?${query}`, {
      method: "POST",
      headers: signed.headers,
      body,
    });
    const rawText = await response.text();
    const submitResult = tryParseJson<JimengSubmitResponse>(rawText);

    if (!response.ok) {
      return {
        ...buildMockPreview(input.fabric, input.prompt, "jimeng"),
        debug: {
          mode: "fallback",
          status: response.status,
          endpoint: `https://${host}/?${query}`,
          model: reqKey,
          responseSnippet: rawText.slice(0, 800),
          message: "Jimeng submit request returned non-2xx response.",
          meta: {
            reqKey,
            inputMode,
            imageCount: imageUrls.length,
            size: input.aiRequest.size,
            width,
            height,
            usedImageUrls: imageUrls,
            localImagePaths,
          },
        },
      };
    }

    const taskId = submitResult?.data?.task_id;

    if (!taskId) {
      return {
        ...buildMockPreview(input.fabric, input.prompt, "jimeng"),
        debug: {
          mode: "fallback",
          status: response.status,
          endpoint: `https://${host}/?${query}`,
          model: reqKey,
          responseSnippet: rawText.slice(0, 800),
          message: "Jimeng response did not contain task_id.",
          meta: {
            reqKey,
            inputMode,
            imageCount: imageUrls.length,
            size: input.aiRequest.size,
            width,
            height,
            usedImageUrls: imageUrls,
            localImagePaths,
          },
        },
      };
    }

    const pollResult = await pollJimengResult({
      host,
      accessKeyId,
      secretAccessKey,
      region,
      service,
      reqKey,
      taskId,
      timeoutMs,
      pollIntervalMs,
    });

    if (pollResult.imageUrl) {
      return {
        imageUrl: pollResult.imageUrl,
        prompt: input.aiRequest.prompt,
        provider: "jimeng",
        generatedAt: new Date().toISOString(),
        debug: {
          mode: "real",
          status: pollResult.statusCode,
          endpoint: pollResult.endpoint,
          model: reqKey,
          responseSnippet: pollResult.responseSnippet,
          message: "Jimeng image generated successfully after polling.",
          meta: {
            reqKey,
            inputMode,
            imageCount: imageUrls.length,
            size: input.aiRequest.size,
            width,
            height,
            usedImageUrls: imageUrls,
            localImagePaths,
          },
        },
      };
    }

    return {
      ...buildMockPreview(input.fabric, input.prompt, "jimeng"),
      debug: {
        mode: "fallback",
        status: pollResult.statusCode,
        endpoint: pollResult.endpoint,
        model: reqKey,
        responseSnippet: pollResult.responseSnippet,
        message: pollResult.errorMessage,
        meta: {
          reqKey,
          inputMode,
          imageCount: imageUrls.length,
          size: input.aiRequest.size,
          width,
          height,
          usedImageUrls: imageUrls,
          localImagePaths,
        },
      },
    };
  } catch (error) {
    return {
      ...buildMockPreview(input.fabric, input.prompt, "jimeng"),
      debug: {
        mode: "fallback",
        endpoint: `https://${host}/?${query}`,
        model: reqKey,
        message:
          error instanceof Error
            ? `Jimeng request failed: ${error.message}`
            : "Jimeng request failed before a valid response was parsed.",
        meta: {
          reqKey,
          inputMode,
          imageCount: imageUrls.length,
          size: input.aiRequest.size,
          width,
          height,
          usedImageUrls: imageUrls,
          localImagePaths,
        },
      },
    };
  }
}

export async function generatePreviewWithFallback(
  input: GeneratePreviewInput
): Promise<GeneratedPreview> {
  const configuredProvider = input.aiRequest.provider;

  if (configuredProvider === "flux") {
    return generatePreviewWithFlux(input);
  }

  if (configuredProvider === "jimeng") {
    return generatePreviewWithJimeng(input);
  }

  return {
    ...buildMockPreview(input.fabric, input.prompt, configuredProvider),
    debug: {
      mode: "fallback",
      model: input.aiRequest.model,
      message: `Unsupported image provider: ${configuredProvider}`,
    },
  };
}
