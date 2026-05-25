type SelectionCardProps = {
  title: string;
  subtitle: string;
  detail: string;
  isActive: boolean;
  accentSoft: string;
  variant?: "default" | "fabric";
  swatch?: string;
  secondarySwatch?: string;
  detailSwatch?: string;
  pattern?: string;
  onClick: () => void;
};

const fabricPatternMap: Record<string, string> = {
  embroidery:
    "radial-gradient(circle at 24% 26%, rgba(255,255,255,0.36) 0 9%, transparent 10%), radial-gradient(circle at 72% 68%, rgba(255,245,235,0.28) 0 10%, transparent 11%)",
  jacquard:
    "linear-gradient(45deg, rgba(255,255,255,0.14) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.14) 75%, transparent 75%, transparent)",
  gift:
    "linear-gradient(90deg, transparent 46%, rgba(255,255,255,0.28) 46% 54%, transparent 54%), linear-gradient(0deg, transparent 46%, rgba(255,255,255,0.22) 46% 54%, transparent 54%)",
  tailor:
    "linear-gradient(135deg, rgba(255,255,255,0.12) 25%, transparent 25%), linear-gradient(315deg, rgba(255,255,255,0.12) 25%, transparent 25%)",
  luxe:
    "radial-gradient(circle at 18% 30%, rgba(255,255,255,0.18) 0 14%, transparent 15%), radial-gradient(circle at 74% 60%, rgba(255,255,255,0.18) 0 14%, transparent 15%)",
  gold:
    "linear-gradient(135deg, rgba(255,242,214,0.4), transparent 35%), linear-gradient(315deg, rgba(255,228,192,0.18), transparent 30%)",
  cloud:
    "radial-gradient(circle at 26% 42%, rgba(255,255,255,0.62) 0 12%, transparent 13%), radial-gradient(circle at 42% 38%, rgba(255,255,255,0.55) 0 10%, transparent 11%), radial-gradient(circle at 62% 60%, rgba(255,255,255,0.42) 0 12%, transparent 13%)",
  forest:
    "linear-gradient(120deg, transparent 0 38%, rgba(255,255,255,0.14) 38% 42%, transparent 42% 100%), linear-gradient(60deg, transparent 0 56%, rgba(255,255,255,0.14) 56% 60%, transparent 60% 100%)",
  stars:
    "radial-gradient(circle at 18% 22%, rgba(255,248,202,0.82) 0 1.2%, transparent 1.3%), radial-gradient(circle at 72% 18%, rgba(255,248,202,0.82) 0 1.2%, transparent 1.3%), radial-gradient(circle at 58% 62%, rgba(255,248,202,0.82) 0 1.4%, transparent 1.5%), radial-gradient(circle at 85% 45%, rgba(255,248,202,0.72) 0 1%, transparent 1.1%)",
};

export function SelectionCard({
  title,
  subtitle,
  detail,
  isActive,
  accentSoft,
  variant = "default",
  swatch,
  secondarySwatch,
  detailSwatch,
  pattern,
  onClick,
}: SelectionCardProps) {
  const isFabric = variant === "fabric" && swatch && secondarySwatch;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[24px] border p-4 text-left transition ${
        isActive
          ? `border-[#d8b8aa] ${accentSoft} shadow-[0_18px_36px_rgba(94,48,33,0.08)]`
          : "border-[#ead9cf] bg-white hover:bg-[#fffaf6]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-4">
          {isFabric ? (
            <div className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-[20px] border border-black/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(145deg, ${secondarySwatch}, ${swatch})`,
                }}
              />
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundImage: pattern ? fabricPatternMap[pattern] : undefined,
                  backgroundSize:
                    pattern === "jacquard"
                      ? "22px 22px"
                      : pattern === "forest"
                        ? "58px 58px"
                        : "100% 100%",
                }}
              />
              <div className="absolute inset-x-3 top-3 h-px bg-white/30" />
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <span
                  className="h-3.5 w-3.5 rounded-full border border-white/50"
                  style={{ backgroundColor: swatch }}
                />
                <span
                  className="h-3.5 w-3.5 rounded-full border border-white/50"
                  style={{ backgroundColor: secondarySwatch }}
                />
                {detailSwatch ? (
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/50"
                    style={{ backgroundColor: detailSwatch }}
                  />
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="min-w-0 space-y-1">
            <h4 className="text-base font-semibold text-[#2d201a]">{title}</h4>
            <p className="text-sm font-medium text-[#8b6150]">{subtitle}</p>
            <p className="mt-2 text-sm leading-6 text-[#70584d]">{detail}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            isActive
              ? "bg-white/85 text-[#8b5a48]"
              : "bg-[#f8ece5] text-[#9c614c]"
          }`}
        >
          {isActive ? "当前" : "可选"}
        </span>
      </div>
    </button>
  );
}
