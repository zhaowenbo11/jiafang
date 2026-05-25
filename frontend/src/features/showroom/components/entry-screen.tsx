import { BusinessEntryCard } from "./business-entry-card";
import type { BusinessConfig, BusinessId } from "../types";

type EntryScreenProps = {
  businesses: BusinessConfig[];
  selectedBusiness: BusinessId;
  setSelectedBusiness: (id: BusinessId) => void;
  onEnterDemo: () => void;
};

export function EntryScreen({
  businesses,
  selectedBusiness,
  setSelectedBusiness,
  onEnterDemo,
}: EntryScreenProps) {
  return (
    <section className="overflow-hidden rounded-[38px] bg-[linear-gradient(135deg,#311917_0%,#6f4037_40%,#b68974_74%,#e9d8ca_100%)] p-6 text-white shadow-[0_30px_90px_rgba(88,46,36,0.2)] sm:p-8">
      <div className="mx-auto max-w-5xl text-center">
        <div className="inline-flex rounded-full bg-white/14 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#fce9dd]">
          Step 01
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
          先选择顾客的主营业务
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#f6ddd1] sm:text-base">
          第一屏只做业务分流。导购根据顾客需求选择业务线，然后进入第二屏继续做布料、模板和效果图演示。
        </p>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        {businesses.map((business) => (
          <BusinessEntryCard
            key={business.id}
            business={business}
            isSelected={business.id === selectedBusiness}
            onSelect={setSelectedBusiness}
            onEnter={onEnterDemo}
          />
        ))}
      </div>
    </section>
  );
}
