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
};

const roomTone = {
  wedding: {
    wall: "linear-gradient(180deg, rgba(255,246,241,0.98), rgba(239,199,170,0.54))",
    floor: "linear-gradient(180deg, rgba(147,62,64,0.24), rgba(105,31,40,0.42))",
    decor: "婚房陈列",
    vignette: "rgba(110,27,40,0.18)",
  },
  custom: {
    wall: "linear-gradient(180deg, rgba(248,243,238,0.98), rgba(225,205,186,0.58))",
    floor: "linear-gradient(180deg, rgba(111,86,69,0.18), rgba(76,51,38,0.38))",
    decor: "高定陈列",
    vignette: "rgba(83,50,37,0.16)",
  },
  kids: {
    wall: "linear-gradient(180deg, rgba(244,252,255,0.98), rgba(201,229,239,0.56))",
    floor: "linear-gradient(180deg, rgba(110,157,177,0.18), rgba(79,120,141,0.34))",
    decor: "儿童房陈列",
    vignette: "rgba(54,102,124,0.16)",
  },
} as const;

const fabricTextureMap = {
  embroidery:
    "radial-gradient(circle at 22% 28%, rgba(255,255,255,0.35) 0 8%, transparent 9%), radial-gradient(circle at 68% 56%, rgba(255,227,201,0.28) 0 9%, transparent 10%), radial-gradient(circle at 42% 74%, rgba(255,255,255,0.18) 0 6%, transparent 7%)",
  jacquard:
    "linear-gradient(45deg, rgba(255,255,255,0.12) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.12) 75%, transparent 75%, transparent)",
  gift:
    "linear-gradient(90deg, transparent 46%, rgba(255,244,236,0.38) 46% 54%, transparent 54%), linear-gradient(0deg, transparent 46%, rgba(255,244,236,0.28) 46% 54%, transparent 54%)",
  tailor:
    "linear-gradient(135deg, rgba(255,255,255,0.08) 25%, transparent 25%), linear-gradient(315deg, rgba(255,255,255,0.08) 25%, transparent 25%)",
  luxe:
    "radial-gradient(circle at 20% 24%, rgba(255,255,255,0.12) 0 16%, transparent 17%), radial-gradient(circle at 64% 74%, rgba(255,255,255,0.12) 0 16%, transparent 17%)",
  gold:
    "linear-gradient(135deg, rgba(255,243,219,0.42), transparent 35%), linear-gradient(315deg, rgba(255,233,197,0.22), transparent 30%)",
  cloud:
    "radial-gradient(circle at 30% 35%, rgba(255,255,255,0.62) 0 12%, transparent 13%), radial-gradient(circle at 43% 33%, rgba(255,255,255,0.58) 0 10%, transparent 11%), radial-gradient(circle at 60% 58%, rgba(255,255,255,0.44) 0 12%, transparent 13%)",
  forest:
    "linear-gradient(120deg, transparent 0 38%, rgba(255,255,255,0.14) 38% 42%, transparent 42% 100%), linear-gradient(60deg, transparent 0 56%, rgba(255,255,255,0.14) 56% 60%, transparent 60% 100%)",
  stars:
    "radial-gradient(circle at 18% 22%, rgba(255,248,202,0.72) 0 1.2%, transparent 1.3%), radial-gradient(circle at 72% 18%, rgba(255,248,202,0.72) 0 1.2%, transparent 1.3%), radial-gradient(circle at 58% 62%, rgba(255,248,202,0.72) 0 1.4%, transparent 1.5%), radial-gradient(circle at 85% 45%, rgba(255,248,202,0.6) 0 1%, transparent 1.1%)",
} as const;

function getPatternSize(pattern: FabricOption["pattern"]) {
  if (pattern === "jacquard") return "26px 26px";
  if (pattern === "forest") return "78px 78px";
  return "100% 100%";
}

function resolvePreviewFailureMessage(generatedPreview: GeneratedPreview | null) {
  const status = generatedPreview?.debug?.status;
  const message = generatedPreview?.debug?.message?.toLowerCase() || "";
  const response = generatedPreview?.debug?.responseSnippet?.toLowerCase() || "";

  if (status === 402 || response.includes("insufficient credits")) {
    return "AI 账户余额不足，当前无法生成智能效果图。请充值后重试，系统已保留真实布料预览。";
  }

  if (status === 401 || response.includes("unauthorized")) {
    return "AI 接口鉴权失败，请检查 API Key 配置是否正确。系统已保留真实布料预览。";
  }

  if (status === 403 || response.includes("forbidden")) {
    return "当前账号暂无该模型调用权限，请确认模型权限后重试。系统已保留真实布料预览。";
  }

  if (message.includes("timed out") || response.includes("timed out")) {
    return "AI 生成请求超时，可能是网络或上游服务较慢。请稍后重试，系统已保留真实布料预览。";
  }

  return "当前未成功返回智能效果图，系统已保留真实布料预览，不影响继续选款。";
}

function resolvePreviewStateText(
  isGeneratingPreview: boolean,
  aiSucceeded: boolean | undefined,
  hasAiResult: boolean
) {
  if (isGeneratingPreview) return "正在生成参考效果";
  if (aiSucceeded) return "已生成效果参考";
  if (hasAiResult) return "智能生成未完成，当前保留真实布料预览";
  return "当前展示真实布料预览";
}

function resolveHeroTitle(businessId: BusinessId) {
  if (businessId === "wedding") return "婚房成品氛围预览";
  if (businessId === "custom") return "高定成品效果预览";
  return "儿童床品安心预览";
}

function resolveHeroDescription(isDetail: boolean, isScene: boolean) {
  if (isDetail) return "重点查看布料纹理、花型和局部工艺细节。";
  if (isScene) return "重点查看布料在整体空间中的搭配氛围。";
  return "重点查看整套上床后的整体效果。";
}

function resolveLayerTitle(isDetail: boolean, isScene: boolean) {
  if (isDetail) return "面料细节层";
  if (isScene) return "场景搭配层";
  return "主成品层";
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
}: ResultPreviewProps) {
  const activeRoomTone = roomTone[businessId];
  const isDetail = selectedTemplate.layout === "detail";
  const isScene = selectedTemplate.layout === "scene";
  const isDev = process.env.NODE_ENV !== "production";
  const hasAiResult = Boolean(generatedPreview);
  const aiSucceeded = generatedPreview?.debug?.mode === "real";
  const failureMessage = resolvePreviewFailureMessage(generatedPreview);

  const surfaceStyle = {
    background: `linear-gradient(180deg, ${selectedFabric.secondarySwatch}, ${selectedFabric.swatch})`,
    backgroundImage: fabricTextureMap[selectedFabric.pattern],
    backgroundSize: getPatternSize(selectedFabric.pattern),
  };

  const activeRealImageUrl = isDetail
    ? selectedFabric.detailImageUrl || selectedFabric.imageUrl
    : selectedFabric.imageUrl;
  const showRealFabricImage = Boolean(activeRealImageUrl);

  return (
    <article className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(94,48,33,0.1)]">
      <div className={`bg-gradient-to-br ${selectedFabric.previewGradient} p-5`}>
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
                {resolveHeroDescription(isDetail, isScene)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-white/62">
                模板模式
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {selectedTemplate.previewTag}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            <div className="flex items-center justify-between rounded-[20px] border border-white/16 bg-[rgba(255,255,255,0.1)] px-4 py-3 backdrop-blur-sm">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-white/72">
                  智能效果生成
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
                disabled={isGeneratingPreview}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5f2a2c] transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGeneratingPreview ? "生成中..." : "生成智能效果图"}
              </button>
            </div>

            {generatedPreview ? (
              <div className="overflow-hidden rounded-[24px] border border-white/18 bg-[rgba(255,255,255,0.12)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedPreview.imageUrl}
                  alt={selectedFabric.name}
                  className="h-[220px] w-full object-cover"
                />
                <div className="space-y-2 px-4 py-3 text-white/88">
                  <p className="text-xs font-semibold tracking-[0.14em]">
                    {aiSucceeded ? "智能效果参考" : "智能生成结果"}
                  </p>
                  <p className="text-sm leading-6">
                    {aiSucceeded
                      ? "已根据当前布料和模板生成参考效果，可辅助客户判断整体氛围。"
                      : failureMessage}
                  </p>
                  {isDev && generatedPreview.debug ? (
                    <div className="rounded-[16px] bg-black/12 p-3 text-xs leading-5 text-white/88">
                      <p>mode: {generatedPreview.debug.mode}</p>
                      <p>status: {generatedPreview.debug.status ?? "n/a"}</p>
                      <p>endpoint: {generatedPreview.debug.endpoint ?? "n/a"}</p>
                      <p>message: {generatedPreview.debug.message ?? "n/a"}</p>
                      <p className="break-all">
                        response: {generatedPreview.debug.responseSnippet ?? "n/a"}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="relative overflow-hidden rounded-[28px] border border-white/18 bg-[rgba(255,255,255,0.08)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_18px_40px_rgba(48,22,18,0.14)]">
              {showRealFabricImage ? (
                <div className="relative overflow-hidden rounded-[24px] border border-white/12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeRealImageUrl}
                    alt={selectedFabric.name}
                    className="h-[292px] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(34,14,12,0.72))] px-4 py-4">
                    <p className="text-xs font-semibold tracking-[0.14em] text-white/70">
                      真实布料预览
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {selectedFabric.name}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="absolute inset-x-0 top-0 h-[70%]"
                    style={{ background: activeRoomTone.wall }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-[34%]"
                    style={{ background: activeRoomTone.floor }}
                  />
                  <div className="absolute left-[6%] top-[8%] h-20 w-20 rounded-full bg-white/8 blur-[2px]" />
                  <div className="absolute right-[8%] top-[12%] h-24 w-24 rounded-full bg-white/8 blur-[1px]" />
                  <div className="absolute inset-x-[18%] top-[16%] h-px bg-white/22" />
                  <div className="absolute inset-x-[14%] top-[18%] h-px bg-white/10" />

                  <div className="relative flex h-[260px] items-end justify-center sm:h-[292px]">
                    <div className="absolute left-[9%] top-[10%] rounded-full border border-white/24 bg-white/14 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-white/90">
                      {activeRoomTone.decor}
                    </div>
                    <div className="absolute right-[9%] top-[10%] rounded-full bg-black/10 px-3 py-1.5 text-[11px] font-medium tracking-[0.14em] text-white/82 backdrop-blur-sm">
                      {selectedFabric.previewLabel}
                    </div>

                    <div
                      className="absolute inset-x-[18%] bottom-[16%] h-10 rounded-[24px] bg-[var(--vignette)] blur-2xl"
                      style={{ ["--vignette" as never]: activeRoomTone.vignette }}
                    />

                    <div
                      className={`relative mx-auto w-full max-w-[78%] ${
                        isDetail ? "origin-bottom scale-[1.08]" : ""
                      }`}
                    >
                      <div className="mx-auto h-7 w-[56%] rounded-t-[30px] border border-white/20 bg-[rgba(255,255,255,0.18)] shadow-[0_10px_20px_rgba(63,28,25,0.2)]" />
                      <div className="mx-auto h-4 w-[64%] rounded-t-[20px] bg-[rgba(255,255,255,0.12)]" />
                      <div className="relative mx-auto -mt-1 h-[180px] overflow-hidden rounded-[34px] border border-white/14 bg-[rgba(255,255,255,0.08)] px-5 pt-5 shadow-[0_28px_54px_rgba(54,28,20,0.24)] sm:h-[198px]">
                        <div className="flex justify-between px-5">
                          {[0, 1].map((item) => (
                            <div
                              key={item}
                              className="h-12 w-[29%] rounded-[18px] border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] sm:h-13"
                              style={surfaceStyle}
                            />
                          ))}
                        </div>
                        <div
                          className="relative mt-4 h-[104px] overflow-hidden rounded-[24px] border border-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] sm:h-[114px]"
                          style={surfaceStyle}
                        >
                          <div
                            className="absolute inset-0 opacity-80"
                            style={{
                              backgroundImage:
                                fabricTextureMap[selectedFabric.pattern],
                              backgroundSize: getPatternSize(selectedFabric.pattern),
                            }}
                          />
                          <div className="absolute inset-x-7 top-6 h-[1px] bg-white/30" />
                          <div className="absolute inset-x-7 top-10 h-[1px] bg-white/14" />
                          <div className="absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.08))]" />
                          <div className="absolute inset-x-0 bottom-0 h-8 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.08))]" />

                          {(selectedFabric.pattern === "embroidery" ||
                            selectedFabric.pattern === "tailor" ||
                            selectedFabric.pattern === "gold") && (
                            <div
                              className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                              style={{
                                borderColor: `${selectedFabric.detailSwatch}bb`,
                                boxShadow: `0 0 0 6px ${selectedFabric.detailSwatch}22`,
                              }}
                            />
                          )}

                          {selectedFabric.pattern === "cloud" ? (
                            <div className="absolute inset-x-[20%] top-[18%] h-12 rounded-full bg-white/24 blur-sm" />
                          ) : null}

                          {selectedFabric.pattern === "forest" ? (
                            <>
                              <div className="absolute bottom-4 left-4 h-14 w-8 rounded-t-[18px] bg-green-900/20 blur-[0.2px]" />
                              <div className="absolute bottom-3 right-5 h-16 w-9 rounded-t-[18px] bg-green-800/16 blur-[0.2px]" />
                            </>
                          ) : null}

                          {isScene ? (
                            <>
                              <div
                                className="absolute bottom-5 left-3 h-12 w-11 rounded-[16px] border border-white/20 sm:h-13 sm:w-12"
                                style={{
                                  background: `linear-gradient(180deg, ${selectedFabric.detailSwatch}, ${selectedFabric.secondarySwatch})`,
                                }}
                              />
                              <div
                                className="absolute bottom-4 right-4 h-10 w-18 rounded-[18px] border border-white/18 sm:h-11 sm:w-20"
                                style={{
                                  background: `linear-gradient(145deg, ${selectedFabric.swatch}, ${selectedFabric.secondarySwatch})`,
                                }}
                              />
                            </>
                          ) : null}

                          {isDetail ? (
                            <div className="absolute right-4 top-4 rounded-full bg-white/88 px-3 py-1 text-[11px] font-semibold text-[#6f4d42]">
                              工艺放大
                            </div>
                          ) : null}

                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.06))]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between rounded-[22px] border border-white/16 bg-[rgba(255,255,255,0.1)] px-4 py-3 backdrop-blur-sm">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-white/72">
                  当前展示
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  {resolveLayerTitle(isDetail, isScene)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-11 rounded-[14px] border border-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                  style={{
                    background: `linear-gradient(145deg, ${selectedFabric.swatch}, ${selectedFabric.secondarySwatch})`,
                  }}
                />
                <div className="text-right">
                  <p className="text-xs font-medium text-white/72">当前布料</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {selectedFabric.name}
                  </p>
                </div>
              </div>
            </div>
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
                index === 0
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
  );
}
