"use client";

import { useState } from "react";
import type {
  BusinessId,
  FabricOption,
  GeneratedPreview,
  TemplateOption,
} from "../types";

type ResultPreviewProps = {
  businessId: BusinessId;
  accentSoft: string;
  title: string;
  summary: string;
  templateSummary: string;
  actions: string[];
  selectedFabric: FabricOption;
  selectedTemplate: TemplateOption;
  generatedPreview: GeneratedPreview | null;
  isGeneratingPreview: boolean;
  onGeneratePreview: () => void;
  canGeneratePreview: boolean;
};

const roomTone: Record<BusinessId, { decor: string }> = {
  wedding: {
    decor: "婚庆婚床模板",
  },
  custom: {
    decor: "高端定制主卧模板",
  },
};

function resolvePreviewFailureMessage(generatedPreview: GeneratedPreview | null) {
  const status = generatedPreview?.debug?.status;
  const message = generatedPreview?.debug?.message?.toLowerCase() || "";
  const response = generatedPreview?.debug?.responseSnippet?.toLowerCase() || "";

  if (status === 402 || response.includes("insufficient credits")) {
    return "AI 账户余额不足，当前无法生成真实成品图，系统暂时保留模板预览。";
  }

  if (status === 401 || response.includes("unauthorized")) {
    return "AI 接口鉴权失败，请检查 API 配置，系统暂时保留模板预览。";
  }

  if (status === 403 || response.includes("forbidden")) {
    return "当前账号暂未开通该模型权限，请确认权限后重试。";
  }

  if (status === 500 || response.includes("internal error")) {
    return "AI 服务端返回内部错误，请稍后重试。";
  }

  if (message.includes("timed out") || response.includes("timed out")) {
    return "AI 请求超时，请稍后重试。";
  }

  return "当前未成功返回 AI 成品图，系统暂时保留模板预览。";
}

function resolvePreviewStateText(
  isGeneratingPreview: boolean,
  aiSucceeded: boolean | undefined,
  hasAiResult: boolean
) {
  if (isGeneratingPreview) return "正在生成真实成品图";
  if (aiSucceeded) return "已生成 AI 成品图";
  if (hasAiResult) return "AI 未成功返回，当前保留模板图";
  return "当前显示模板图";
}

function resolveHeroTitle(businessId: BusinessId) {
  if (businessId === "wedding") return "婚庆模板预览";
  return "主卧模板预览";
}

function resolveHeroDescription(aiSucceeded: boolean | undefined) {
  if (aiSucceeded) {
    return "当前主图已经切换为 AI 成品图，可点击放大查看整体效果与布料细节。";
  }

  return "右侧先展示模板底图，AI 生成成功后会直接覆盖到当前主图位置。";
}

export function ResultPreview({
  businessId,
  accentSoft,
  title,
  summary,
  templateSummary,
  actions,
  selectedFabric,
  selectedTemplate,
  generatedPreview,
  isGeneratingPreview,
  onGeneratePreview,
  canGeneratePreview,
}: ResultPreviewProps) {
  const [isImageZoomOpen, setIsImageZoomOpen] = useState(false);
  const activeRoomTone = roomTone[businessId];
  const isDev = process.env.NODE_ENV !== "production";
  const hasAiResult = Boolean(generatedPreview);
  const aiSucceeded = generatedPreview?.debug?.mode === "real";
  const failureMessage = resolvePreviewFailureMessage(generatedPreview);
  const heroImageUrl =
    aiSucceeded && generatedPreview?.imageUrl
      ? generatedPreview.imageUrl
      : selectedTemplate.baseImageUrl;
  const heroImageLabel = aiSucceeded ? "AI 成品图" : "模板底图";

  return (
    <>
      <article className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(94,48,33,0.1)]">
        <div
          className={`bg-gradient-to-br ${selectedFabric.previewGradient} p-5`}
        >
          <div className="flex min-h-[420px] flex-col rounded-[24px] border border-white/25 bg-[linear-gradient(160deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-[65%]">
                <span className="inline-flex rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-[#57202b]">
                  门店实时预览
                </span>
                <h3 className="mt-3 text-[26px] font-semibold tracking-[0.01em] text-white">
                  {resolveHeroTitle(businessId)}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  {resolveHeroDescription(aiSucceeded)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-white/62">
                  当前展示
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {heroImageLabel}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <div className="flex items-center justify-between rounded-[20px] border border-white/16 bg-[rgba(255,255,255,0.1)] px-4 py-3 backdrop-blur-sm">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-white/72">
                    当前阶段
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {resolvePreviewStateText(
                      isGeneratingPreview,
                      aiSucceeded,
                      hasAiResult
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onGeneratePreview}
                  disabled={isGeneratingPreview || !canGeneratePreview}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5f2a2c] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGeneratingPreview
                    ? "生成中..."
                    : canGeneratePreview
                      ? "确认后生成 AI 成品图"
                      : "请先选择布料细节图"}
                </button>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-white/18 bg-[rgba(255,255,255,0.08)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_18px_40px_rgba(48,22,18,0.14)]">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-white/72">
                      {aiSucceeded ? "AI 成品图" : "模板底图"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {activeRoomTone.decor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {aiSucceeded ? (
                      <span className="rounded-full bg-white/18 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-white/90 backdrop-blur-sm">
                        已覆盖模板展示
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setIsImageZoomOpen(true)}
                      className="rounded-full bg-black/10 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-white/82 backdrop-blur-sm transition hover:bg-black/18"
                    >
                      点击放大
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsImageZoomOpen(true)}
                  className="block w-full overflow-hidden rounded-[24px] border border-white/12 bg-white/10 text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroImageUrl}
                    alt={selectedFabric.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              </div>

              {generatedPreview ? (
                <div className="rounded-[24px] border border-white/18 bg-[rgba(255,255,255,0.12)] px-4 py-3 text-white/88">
                  <p className="text-xs font-semibold tracking-[0.14em]">
                    {aiSucceeded ? "AI 返回结果" : "AI 失败说明"}
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    {aiSucceeded
                      ? "AI 成品图已经覆盖到主预览图位置，客户可直接点击放大查看细节。"
                      : failureMessage}
                  </p>
                  {isDev && generatedPreview.debug ? (
                    <div className="mt-3 rounded-[16px] bg-black/12 p-3 text-xs leading-5 text-white/88">
                      <p>mode: {generatedPreview.debug.mode}</p>
                      <p>status: {generatedPreview.debug.status ?? "n/a"}</p>
                      <p>endpoint: {generatedPreview.debug.endpoint ?? "n/a"}</p>
                      <p>model: {generatedPreview.debug.model ?? "n/a"}</p>
                      <p>message: {generatedPreview.debug.message ?? "n/a"}</p>
                      <p>
                        req_key: {generatedPreview.debug.meta?.reqKey ?? "n/a"}
                      </p>
                      <p>
                        input_mode:{" "}
                        {generatedPreview.debug.meta?.inputMode ?? "n/a"}
                      </p>
                      <p>
                        image_count:{" "}
                        {generatedPreview.debug.meta?.imageCount ?? "n/a"}
                      </p>
                      <p>
                        size: {generatedPreview.debug.meta?.size ?? "n/a"}
                      </p>
                      <p>
                        width: {generatedPreview.debug.meta?.width ?? "n/a"}
                      </p>
                      <p>
                        height: {generatedPreview.debug.meta?.height ?? "n/a"}
                      </p>
                      <p className="break-all">
                        image_urls:{" "}
                        {generatedPreview.debug.meta?.usedImageUrls?.join(", ") ||
                          "n/a"}
                      </p>
                      <p className="break-all">
                        local_paths:{" "}
                        {generatedPreview.debug.meta?.localImagePaths?.join(", ") ||
                          "n/a"}
                      </p>
                      <p className="break-all">
                        response: {generatedPreview.debug.responseSnippet ?? "n/a"}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <div className={`rounded-[22px] ${accentSoft} px-4 py-4`}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-[#2b1d18]">{title}</h3>
              <span
                className="rounded-full px-3 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: selectedFabric.swatch }}
              >
                {selectedFabric.previewLabel}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#71574a]">{summary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] bg-white/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8e6253]">
                  当前布料
                </p>
                <p className="mt-2 text-sm font-semibold text-[#2d201a]">
                  {selectedFabric.name}
                </p>
                <p className="mt-1 text-sm text-[#72584d]">
                  {selectedFabric.detail}
                </p>
              </div>
              <div className="rounded-[18px] bg-white/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8e6253]">
                  当前模板
                </p>
                <p className="mt-2 text-sm font-semibold text-[#2d201a]">
                  {selectedTemplate.name}
                </p>
                <p className="mt-1 text-sm text-[#72584d]">
                  {selectedTemplate.detail}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#71574a]">
              {templateSummary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {actions.map((action, index) => (
              <button
                key={action}
                type="button"
                className={`rounded-[20px] px-4 py-3 text-sm font-medium transition ${
                  index === 2
                    ? "bg-[#8f2438] text-white hover:bg-[#7f2032]"
                    : "border border-[#dcc2b3] bg-white text-[#6f5448] hover:bg-[#f8efe8]"
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </article>

      {isImageZoomOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e120e]/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl rounded-[28px] border border-white/20 bg-[#fff8f2] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6a57]">
                  图片预览
                </p>
                <h3 className="mt-1 text-xl font-semibold text-[#2b1d18]">
                  {aiSucceeded ? "AI 成品图大图" : "模板底图大图"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImageZoomOpen(false)}
                className="rounded-full border border-[#dbc8bb] bg-white px-4 py-2 text-sm font-medium text-[#6f5448] transition hover:bg-[#f8efe8]"
              >
                关闭
              </button>
            </div>

            <div className="overflow-hidden rounded-[24px] bg-[#f3e6dc]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageUrl}
                alt={selectedFabric.name}
                className="max-h-[82vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
