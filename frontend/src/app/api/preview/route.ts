import { NextResponse } from "next/server";
import { getShowroomData } from "@/features/showroom/service";
import { getFabricById } from "@/features/showroom/catalog";
import { generatePreviewWithFallback } from "@/features/showroom/ai-preview";
import {
  createPreviewJob,
  updatePreviewJob,
} from "@/features/showroom/preview-job-service";
import type { PreviewRequestPayload } from "@/features/showroom/types";

export async function POST(request: Request) {
  const body = (await request.json()) as PreviewRequestPayload;
  const { fabricLibrary } = await getShowroomData();
  const fabric = getFabricById(fabricLibrary, body.fabricId);

  if (!fabric) {
    return NextResponse.json({ message: "Fabric not found" }, { status: 404 });
  }

  const job = createPreviewJob(body, fabric);
  updatePreviewJob(job.id, { status: "processing" });

  const preview = await generatePreviewWithFallback({
    businessId: body.businessId,
    fabric,
    templateType: body.templateType,
    templateName: body.templateName,
    prompt: job.prompt,
    imageInputs: job.imageInputs,
  });

  updatePreviewJob(job.id, {
    status: preview.debug?.mode === "real" ? "succeeded" : "failed",
    resultImageUrl: preview.imageUrl,
    errorMessage:
      preview.debug?.mode === "real" ? undefined : preview.debug?.message,
  });

  return NextResponse.json({
    jobId: job.id,
    ...preview,
  });
}
