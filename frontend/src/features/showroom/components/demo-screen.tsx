import { useMemo, useState } from "react";
import { ResultPreview } from "./result-preview";
import { SectionTitle } from "./section-title";
import type {
  BusinessConfig,
  FabricLibraryItem,
  GeneratedPreview,
} from "../types";

const AI_REQUEST_TIMEOUT_MS = 120000;

type DemoScreenProps = {
  fabricLibrary: FabricLibraryItem[];
  activeBusiness: BusinessConfig;
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

function toPreviewFabric(item: FabricLibraryItem) {
  return {
    id: item.id,
    name: item.name,
    detail: `${item.material} / ${item.craft}`,
    category: item.category,
    swatch: item.swatch,
    secondarySwatch: item.secondarySwatch,
    detailSwatch: item.detailSwatch,
    previewGradient: item.previewGradient,
    previewLabel: item.previewLabel,
    imageUrl: item.imageUrl,
    detailImageUrl: item.detailImageUrl,
    pattern: item.pattern,
  };
}

export function DemoScreen({
  fabricLibrary,
  activeBusiness,
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
  const [generatedPreview, setGeneratedPreview] =
    useState<GeneratedPreview | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const activeCategory =
    selectedCategory ||
    selectedFabricOverride?.category ||
    activeBusiness.fabricCategories[0] ||
    "";

  const visibleFabricItems = useMemo(
    () =>
      fabricLibrary.filter(
        (item) =>
          item.business === activeBusiness.id && item.category === activeCategory
      ),
    [fabricLibrary, activeBusiness.id, activeCategory]
  );

  const fallbackFabricLibraryItem =
    visibleFabricItems[0] ??
    fabricLibrary.find((item) => item.business === activeBusiness.id) ??
    null;

  const selectedFabricLibraryItem = selectedFabricOverride;
  const previewFabricLibraryItem =
    selectedFabricOverride ?? fallbackFabricLibraryItem;

  const selectedFabric = previewFabricLibraryItem
    ? toPreviewFabric(previewFabricLibraryItem)
    : toPreviewFabric(
        fabricLibrary.find((item) => item.business === activeBusiness.id)!
      );

  const selectedTemplate =
    activeBusiness.templates[selectedTemplateIndex] ?? activeBusiness.templates[0];

  async function handleGeneratePreview() {
    if (!selectedFabricLibraryItem) return;

    setIsGeneratingPreview(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId: activeBusiness.id,
          fabricId: selectedFabricLibraryItem.id,
          templateType: selectedTemplate.layout,
          templateName: selectedTemplate.name,
          generationStage: "ai_render",
          outputGoal: "sales_preview",
        }),
      });

      if (!response.ok) {
        throw new Error("Preview generation failed");
      }

      const result = (await response.json()) as GeneratedPreview;
      setGeneratedPreview(result);
    } catch {
      setGeneratedPreview({
        imageUrl:
          "https://placehold.co/1200x900/8f2438/f6ddc8?text=Preview+Timeout",
        prompt: "AI 成品图请求超时，当前显示回退结果。",
        provider: "mock",
        generatedAt: new Date().toISOString(),
        debug: {
          mode: "fallback",
          message: "Frontend request timed out or failed.",
        },
      });
    } finally {
      clearTimeout(timeout);
      setIsGeneratingPreview(false);
    }
  }

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
                左侧先按分类筛选布料，并让客户先选中细节图；确认后再点击 AI
                生成成品图。
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
          </div>
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

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[30px] border border-[#ead8cd] bg-white p-5 shadow-[0_16px_48px_rgba(94,48,33,0.06)]">
          <SectionTitle
            eyebrow="布料分类"
            title="选择分类与细节图"
            description="先选择布料分类，再点击某一张布料细节图。客户确认选中后，再点击右侧 AI 生成成品图。"
          />

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-[#6f5448]">
              布料分类
            </label>
            <select
              value={activeCategory}
              onChange={(event) => {
                const nextCategory = event.target.value;
                setSelectedCategory(nextCategory);
                const nextIndex =
                  activeBusiness.fabricCategoryBindings[nextCategory] ?? 0;
                setSelectedFabricIndex(nextIndex);
                setSelectedTemplateIndex(0);
                setSelectedFabricOverride(null);
                setGeneratedPreview(null);
              }}
              className="w-full rounded-[18px] border border-[#e2cdc2] bg-[#fffaf6] px-4 py-3 text-sm text-[#2d201a] outline-none transition focus:border-[#c69782]"
            >
              {activeBusiness.fabricCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#2b1d18]">
                {activeCategory}细节图
              </h3>
              <span className="text-xs font-medium text-[#8b6150]">
                先选图，再生成
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {visibleFabricItems.map((item) => {
                const isActive = selectedFabricOverride?.id === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedFabricOverride(item);
                      setGeneratedPreview(null);
                    }}
                    className={`overflow-hidden rounded-[24px] border text-left transition ${
                      isActive
                        ? "border-[#c69782] bg-[#fff4ed] shadow-[0_18px_40px_rgba(94,48,33,0.1)]"
                        : "border-[#ead8cd] bg-white hover:bg-[#fffaf6]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        item.detailImageUrl ||
                        item.imageUrl ||
                        "https://placehold.co/800x560"
                      }
                      alt={`${item.name} 细节图`}
                      className="h-[190px] w-full object-cover"
                    />
                    <div className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-semibold text-[#2d201a]">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-sm text-[#8b6150]">
                            {item.material} / {item.craft}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            isActive
                              ? "bg-[#8f2438] text-white"
                              : "bg-[#f8ece5] text-[#8b5a48]"
                          }`}
                        >
                          {isActive ? "已选中" : "点击选择"}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-[#70584d]">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </article>

        <ResultPreview
          businessId={activeBusiness.id}
          accentSoft={activeBusiness.accentSoft}
          title={activeBusiness.resultTitle}
          summary={activeBusiness.resultSummary}
          templateSummary={activeBusiness.resultTemplateSummary}
          actions={activeBusiness.actions}
          selectedFabric={selectedFabric}
          selectedTemplate={selectedTemplate}
          generatedPreview={generatedPreview}
          isGeneratingPreview={isGeneratingPreview}
          onGeneratePreview={handleGeneratePreview}
          canGeneratePreview={Boolean(selectedFabricLibraryItem)}
        />
      </div>
    </section>
  );
}
