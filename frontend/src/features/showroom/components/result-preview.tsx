import type { BusinessId, FabricOption, TemplateOption } from "../types";

type ResultPreviewProps = {
  businessId: BusinessId;
  accentSoft: string;
  title: string;
  summary: string;
  templateSummary: string;
  actions: string[];
  selectedFabric: FabricOption;
  selectedTemplate: TemplateOption;
};

const roomTone = {
  wedding: {
    wall: "linear-gradient(180deg, rgba(255,246,241,0.98), rgba(239,199,170,0.52))",
    floor: "linear-gradient(180deg, rgba(135,49,53,0.22), rgba(108,31,37,0.42))",
    decor: "婚房陈列",
  },
  custom: {
    wall: "linear-gradient(180deg, rgba(248,243,238,0.98), rgba(225,205,186,0.56))",
    floor: "linear-gradient(180deg, rgba(106,74,57,0.18), rgba(88,58,44,0.38))",
    decor: "高定陈列",
  },
  kids: {
    wall: "linear-gradient(180deg, rgba(244,252,255,0.98), rgba(201,229,239,0.55))",
    floor: "linear-gradient(180deg, rgba(111,164,187,0.18), rgba(86,132,154,0.34))",
    decor: "儿童房陈列",
  },
} as const;

const patternOverlay = {
  embroidery:
    "radial-gradient(circle at 25% 28%, rgba(255,238,225,0.55) 0 10%, transparent 11%), radial-gradient(circle at 70% 62%, rgba(255,220,188,0.3) 0 12%, transparent 13%)",
  jacquard:
    "linear-gradient(45deg, rgba(255,255,255,0.08) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.08) 75%, transparent 75%, transparent)",
  gift:
    "linear-gradient(90deg, transparent 47%, rgba(255,244,236,0.45) 47% 53%, transparent 53%), linear-gradient(0deg, transparent 47%, rgba(255,244,236,0.35) 47% 53%, transparent 53%)",
  tailor:
    "linear-gradient(135deg, rgba(255,245,235,0.12) 25%, transparent 25%), linear-gradient(315deg, rgba(255,245,235,0.12) 25%, transparent 25%)",
  luxe:
    "radial-gradient(circle at 20% 24%, rgba(255,255,255,0.12) 0 16%, transparent 17%), radial-gradient(circle at 64% 74%, rgba(255,255,255,0.12) 0 16%, transparent 17%)",
  gold:
    "linear-gradient(135deg, rgba(255,243,219,0.44), transparent 35%), linear-gradient(315deg, rgba(255,233,197,0.22), transparent 30%)",
  cloud:
    "radial-gradient(circle at 30% 35%, rgba(255,255,255,0.62) 0 12%, transparent 13%), radial-gradient(circle at 43% 33%, rgba(255,255,255,0.58) 0 10%, transparent 11%), radial-gradient(circle at 60% 58%, rgba(255,255,255,0.44) 0 12%, transparent 13%)",
  forest:
    "linear-gradient(120deg, transparent 0 38%, rgba(255,255,255,0.14) 38% 42%, transparent 42% 100%), linear-gradient(60deg, transparent 0 56%, rgba(255,255,255,0.14) 56% 60%, transparent 60% 100%)",
  stars:
    "radial-gradient(circle at 18% 22%, rgba(255,248,202,0.72) 0 1.2%, transparent 1.3%), radial-gradient(circle at 72% 18%, rgba(255,248,202,0.72) 0 1.2%, transparent 1.3%), radial-gradient(circle at 58% 62%, rgba(255,248,202,0.72) 0 1.4%, transparent 1.5%), radial-gradient(circle at 85% 45%, rgba(255,248,202,0.6) 0 1%, transparent 1.1%)",
} as const;

export function ResultPreview({
  businessId,
  accentSoft,
  title,
  summary,
  templateSummary,
  actions,
  selectedFabric,
  selectedTemplate,
}: ResultPreviewProps) {
  const activeRoomTone = roomTone[businessId];
  const isDetail = selectedTemplate.layout === "detail";
  const isScene = selectedTemplate.layout === "scene";
  const panelTitle = isDetail ? "面料细节放大" : isScene ? "场景搭配预览" : "成套上床效果";
  const posterTitle =
    businessId === "wedding"
      ? "婚房成品氛围预览"
      : businessId === "custom"
        ? "高定成品效果预览"
        : "儿童房安心预览";
  const posterSubtitle = isDetail
    ? "重点查看面料纹理、刺绣与包边工艺"
    : isScene
      ? "重点查看整套搭配与空间氛围"
      : "重点查看整套上床后的整体效果";

  return (
    <article className="overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(94,48,33,0.1)]">
      <div
        className={`bg-gradient-to-br ${selectedFabric.previewGradient} p-5`}
      >
        <div className="flex min-h-[420px] flex-col rounded-[24px] border border-white/25 bg-[linear-gradient(160deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))] p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-[65%]">
              <span className="inline-flex rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-[#57202b]">
                AI 实时成品预览
              </span>
              <h3 className="mt-3 text-[26px] font-semibold tracking-[0.01em] text-white">
                {posterTitle}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/78">
                {posterSubtitle}
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
            <div className="relative overflow-hidden rounded-[28px] border border-white/18 bg-[rgba(255,255,255,0.08)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_18px_40px_rgba(48,22,18,0.14)]">
              <div
                className="absolute inset-x-0 top-0 h-[70%]"
                style={{ background: activeRoomTone.wall }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-[36%]"
                style={{ background: activeRoomTone.floor }}
              />
              <div className="absolute left-[7%] top-[10%] h-20 w-20 rounded-full border border-white/18 bg-white/10 blur-[2px]" />
              <div className="absolute right-[9%] top-[14%] h-24 w-24 rounded-full border border-white/16 bg-white/8 blur-[1px]" />
              <div className="absolute inset-x-[18%] top-[16%] h-px bg-white/24" />
              <div className="absolute inset-x-[14%] top-[18%] h-px bg-white/10" />

              <div className="relative flex h-[260px] items-end justify-center sm:h-[292px]">
                <div
                  className={`absolute left-[9%] top-[10%] rounded-full border border-white/24 bg-white/14 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-white/90 ${
                    isDetail ? "opacity-70" : "opacity-100"
                  }`}
                >
                  {activeRoomTone.decor}
                </div>
                <div className="absolute right-[9%] top-[10%] rounded-full bg-black/10 px-3 py-1.5 text-[11px] font-medium tracking-[0.14em] text-white/82 backdrop-blur-sm">
                  {selectedFabric.previewLabel}
                </div>

                {!isDetail && (
                  <>
                    <div className="absolute inset-x-[16%] bottom-[17%] h-14 rounded-t-[32px] bg-[rgba(81,47,38,0.24)] blur-md" />
                    <div className="absolute inset-x-[18%] bottom-[23%] h-16 rounded-t-[34px] bg-[rgba(255,255,255,0.14)]" />
                  </>
                )}

                <div
                  className={`relative mx-auto w-full max-w-[78%] ${
                    isDetail ? "scale-[1.08] origin-bottom" : ""
                  }`}
                >
                  <div className="mx-auto h-7 w-[56%] rounded-t-[30px] border border-white/20 bg-[rgba(255,255,255,0.18)] shadow-[0_10px_20px_rgba(63,28,25,0.2)]" />
                  <div className="mx-auto h-4 w-[64%] rounded-t-[20px] bg-[rgba(255,255,255,0.12)]" />
                  <div className="relative mx-auto -mt-1 h-[180px] rounded-[34px] border border-white/14 bg-[rgba(255,255,255,0.08)] px-5 pt-5 shadow-[0_28px_54px_rgba(54,28,20,0.24)] sm:h-[198px]">
                    <div className="flex justify-between px-5">
                      {[0, 1].map((item) => (
                        <div
                          key={item}
                          className="h-12 w-[29%] rounded-[18px] border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] sm:h-13"
                          style={{
                            background: `linear-gradient(160deg, ${selectedFabric.secondarySwatch}, ${selectedFabric.swatch})`,
                          }}
                        />
                      ))}
                    </div>
                    <div
                      className="relative mt-4 h-[104px] overflow-hidden rounded-[24px] border border-white/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] sm:h-[114px]"
                      style={{
                        background: `linear-gradient(180deg, ${selectedFabric.secondarySwatch}, ${selectedFabric.swatch})`,
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-80"
                        style={{
                          backgroundImage: patternOverlay[selectedFabric.pattern],
                          backgroundSize:
                            selectedFabric.pattern === "jacquard"
                              ? "26px 26px"
                              : selectedFabric.pattern === "forest"
                                ? "78px 78px"
                                : "100% 100%",
                        }}
                      />
                      <div className="absolute inset-x-7 top-6 h-[1px] bg-white/30" />
                      <div className="absolute inset-x-7 top-10 h-[1px] bg-white/14" />
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.08))]" />
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
                    </div>

                    {isScene && (
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
                    )}

                    {isDetail && (
                      <div className="absolute right-4 top-4 rounded-full bg-white/88 px-3 py-1 text-[11px] font-semibold text-[#6f4d42]">
                        工艺放大
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-[22px] border border-white/16 bg-[rgba(255,255,255,0.1)] px-4 py-3 backdrop-blur-sm">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-white/72">
                  当前展示
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  {panelTitle}
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
                  : "border border-[#dcc2b3] bg-white text-[#6f5348] hover:bg-[#f8efe8]"
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
