import type { BusinessConfig, BusinessId } from "../types";

type BusinessEntryCardProps = {
  business: BusinessConfig;
  isSelected: boolean;
  onSelect: (id: BusinessId) => void;
  onEnter: (id: BusinessId) => void;
};

export function BusinessEntryCard({
  business,
  isSelected,
  onSelect,
  onEnter,
}: BusinessEntryCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-[32px] border transition ${
        isSelected
          ? "border-white/90 bg-white text-[#241915] shadow-[0_28px_80px_rgba(0,0,0,0.18)]"
          : "border-white/22 bg-white/10 text-white"
      }`}
    >
      <div className={`h-2 bg-gradient-to-r ${business.accent}`} />
      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                isSelected
                  ? "bg-[#f7ece5] text-[#8d5441]"
                  : "bg-white/14 text-white/88"
              }`}
            >
              {business.tone}
            </span>
            <span
              className={`text-sm ${
                isSelected ? "text-[#7a5d51]" : "text-white/70"
              }`}
            >
              业务入口
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              {business.title}
            </h2>
            <p
              className={`mt-2 text-sm font-medium ${
                isSelected ? "text-[#7d6154]" : "text-white/72"
              }`}
            >
              {business.subtitle}
            </p>
          </div>
        </div>

        <p
          className={`text-sm leading-7 ${
            isSelected ? "text-[#5f4b42]" : "text-white/82"
          }`}
        >
          {business.description}
        </p>

        <div className="grid gap-3">
          {business.quickStats.map((stat) => (
            <div
              key={stat}
              className={`rounded-[20px] px-4 py-3 text-sm ${
                isSelected
                  ? "bg-[#fbf3ed] text-[#4f3c33]"
                  : "bg-black/10 text-white/84"
              }`}
            >
              {stat}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => onSelect(business.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isSelected
                ? "bg-[#f7ece5] text-[#7a4b3f]"
                : "border border-white/25 bg-white/8 text-white hover:bg-white/14"
            }`}
          >
            选中
          </button>
          <button
            type="button"
            onClick={() => onEnter(business.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isSelected
                ? "bg-[#8f2438] text-white hover:bg-[#7f2032]"
                : "bg-white text-[#4b2a24] hover:bg-[#fff0e6]"
            }`}
          >
            进入演示
          </button>
        </div>
      </div>
    </article>
  );
}
