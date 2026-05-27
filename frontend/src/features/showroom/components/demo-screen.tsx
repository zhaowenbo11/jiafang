import { PaletteCard } from "./palette-card";
import { ResultPreview } from "./result-preview";
import { SectionTitle } from "./section-title";
import { SelectionCard } from "./selection-card";
import { useState } from "react";
import type { BusinessConfig, BusinessId, FabricLibraryItem } from "../types";

type DemoScreenProps = {
  businesses: BusinessConfig[];
  fabricLibrary: FabricLibraryItem[];
  activeBusiness: BusinessConfig;
  onSelectBusiness: (id: BusinessId) => void;
  onBack: () => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedFabricOverride: FabricLibraryItem | null;
  setSelectedFabricOverride: (item: FabricLibraryItem | null) => void;
  selectedFabricIndex: number;
  setSelectedFabricIndex: (index: number) => void;
  selectedTemplateIndex: number;
  setSelectedTemplateIndex: (index: number) => void;
};

export function DemoScreen({
  businesses,
  fabricLibrary,
  activeBusiness,
  onSelectBusiness,
  onBack,
  selectedCategory,
  setSelectedCategory,
  selectedFabricOverride,
  setSelectedFabricOverride,
  selectedFabricIndex,
  setSelectedFabricIndex,
  selectedTemplateIndex,
  setSelectedTemplateIndex,
}: DemoScreenProps) {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const fallbackFabric =
    activeBusiness.fabrics[selectedFabricIndex] ?? activeBusiness.fabrics[0];
  const selectedFabric = selectedFabricOverride
    ? {
        name: selectedFabricOverride.name,
        detail: `${selectedFabricOverride.material} / ${selectedFabricOverride.craft}`,
        category: selectedFabricOverride.category,
        swatch: selectedFabricOverride.swatch,
        secondarySwatch: selectedFabricOverride.secondarySwatch,
        detailSwatch: selectedFabricOverride.detailSwatch,
        previewGradient: selectedFabricOverride.previewGradient,
        previewLabel: selectedFabricOverride.previewLabel,
        pattern: selectedFabricOverride.pattern,
      }
    : fallbackFabric;
  const selectedTemplate =
    activeBusiness.templates[selectedTemplateIndex] ?? activeBusiness.templates[0];
  const activeCategory =
    selectedCategory ||
    selectedFabric.category ||
    activeBusiness.fabricCategories[0] ||
    "";
  const visibleFabricItems = fabricLibrary.filter(
    (item) =>
      item.business === activeBusiness.id && item.category === activeCategory
  );

  return (
    <section className="rounded-[38px] border border-white/70 bg-[#fffaf6] p-6 shadow-[0_22px_70px_rgba(94,48,33,0.08)] sm:p-7">
      <div className="flex flex-col gap-6 border-b border-[#efe0d6] pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex rounded-full bg-[#f8ece5] px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#945948]">
              Step 02
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#2b1d18]">
                {activeBusiness.title}演示页
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[#70574c]">
                这里是门店平板真正给顾客看的第二屏。导购围绕当前业务展示推荐布料、模板和实时效果图，再决定下一步报价或下单。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-[#dec7b8] bg-white px-4 py-2 text-sm font-medium text-[#6f5448] transition hover:bg-[#f8efe8]"
            >
              返回业务选择
            </button>
            <button
              type="button"
              className="rounded-full bg-[#8f2438] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#7f2032]"
            >
              下一步
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {businesses.map((business) => (
            <button
              key={business.id}
              type="button"
              onClick={() => onSelectBusiness(business.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                business.id === activeBusiness.id
                  ? "bg-[#8f2438] text-white"
                  : "border border-[#dec7b8] bg-white text-[#6f5448] hover:bg-[#f8efe8]"
              }`}
            >
              {business.title}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`mt-6 rounded-[28px] border border-[#ead8cd] px-5 py-4 shadow-[0_12px_36px_rgba(94,48,33,0.05)] ${activeBusiness.accentSoft}`}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e5f4f]">
              当前业务
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-semibold text-[#2b1d18]">
                {activeBusiness.title}
              </h3>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-[#935846]">
                {activeBusiness.tone}
              </span>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-[#70574c]">
            {activeBusiness.description}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.72fr_0.72fr_1.16fr]">
        <div className="space-y-6">
          <PaletteCard colors={activeBusiness.palette} />

          <article className="rounded-[30px] border border-[#ead8cd] bg-white p-5 shadow-[0_16px_48px_rgba(94,48,33,0.06)]">
            <SectionTitle
              eyebrow="布料分类"
              title="当前业务分类"
              description="先按业务查看布料分类，后续接入真实布料数据后，再按分类进入具体选择。"
            />
            <div className="mt-5 flex flex-wrap gap-2">
              {activeBusiness.fabricCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    const nextIndex =
                      activeBusiness.fabricCategoryBindings[category] ?? 0;
                    setSelectedFabricIndex(nextIndex);
                    setSelectedFabricOverride(null);
                    setIsCategoryDialogOpen(true);
                  }}
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                    activeCategory === category
                      ? "border-[#c89f8c] bg-[#f8ece5] text-[#7b4c39]"
                      : "border-[#ead8cd] bg-[#fffaf6] text-[#6f5448] hover:bg-[#f8efe8]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-[30px] border border-[#ead8cd] bg-white p-5 shadow-[0_16px_48px_rgba(94,48,33,0.06)]">
            <SectionTitle
              eyebrow="模板切换"
              title="当前演示模板"
              description="按顾客关注点切换正视图、细节图和氛围图。"
            />
            <div className="mt-5 space-y-3">
              {activeBusiness.templates.map((template, index) => (
                <SelectionCard
                  key={template.name}
                  title={template.name}
                  subtitle={activeBusiness.title}
                  detail={template.detail}
                  isActive={index === selectedTemplateIndex}
                  accentSoft={activeBusiness.accentSoft}
                  onClick={() => setSelectedTemplateIndex(index)}
                />
              ))}
            </div>
          </article>
        </div>

        <ResultPreview
          businessId={activeBusiness.id}
          accentSoft={activeBusiness.accentSoft}
          title={activeBusiness.resultTitle}
          summary={activeBusiness.resultSummary}
          templateSummary={activeBusiness.resultTemplateSummary}
          actions={activeBusiness.actions}
          selectedFabric={selectedFabric}
          selectedTemplate={selectedTemplate}
        />
      </div>

      {isCategoryDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2e1c16]/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[32px] border border-white/60 bg-[#fffaf6] p-6 shadow-[0_32px_90px_rgba(54,27,19,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a06b58]">
                  布料分类
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#2b1d18]">
                  {activeCategory}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#72584c]">
                  这里先按 mock 布料库展示该分类下的布料信息。后续接入真实布料库后，可直接替换为后台数据。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryDialogOpen(false)}
                className="rounded-full border border-[#e2cdc2] bg-white px-4 py-2 text-sm font-medium text-[#6f5448] transition hover:bg-[#f8efe8]"
              >
                关闭
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {visibleFabricItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-[#ead8cd] bg-white p-4 shadow-[0_12px_30px_rgba(94,48,33,0.05)]"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="h-[78px] w-[78px] rounded-[20px] border border-black/5"
                      style={{
                        background: `linear-gradient(145deg, ${item.secondarySwatch}, ${item.swatch})`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-semibold text-[#2d201a]">
                        {item.name}
                      </h4>
                      <p className="mt-1 text-sm font-medium text-[#8b6150]">
                        {item.material} / {item.craft}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#70584d]">
                        {item.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#f8ece5] px-2.5 py-1 text-xs font-medium text-[#8b5a48]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-[#7b4c39]">
                          {item.priceRange}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFabricOverride(item);
                            setIsCategoryDialogOpen(false);
                          }}
                          className="rounded-full bg-[#8f2438] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#7f2032]"
                        >
                          选用此布料
                        </button>
                      </div>
                      <p className="mt-2 text-xs font-medium text-[#927164]">
                        适用季节：{item.season}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCategoryDialogOpen(false)}
                className="rounded-full bg-[#8f2438] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#7f2032]"
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
