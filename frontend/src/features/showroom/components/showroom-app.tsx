"use client";

import { useState } from "react";
import { DemoScreen } from "@/features/showroom/components/demo-screen";
import { EntryScreen } from "@/features/showroom/components/entry-screen";
import type {
  BusinessConfig,
  BusinessId,
  FabricLibraryItem,
  Screen,
} from "@/features/showroom/types";

type ShowroomAppProps = {
  businesses: BusinessConfig[];
  fabricLibrary: FabricLibraryItem[];
};

export function ShowroomApp({ businesses, fabricLibrary }: ShowroomAppProps) {
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessId>("wedding");
  const [screen, setScreen] = useState<Screen>("entry");
  const [selectedFabricIndex, setSelectedFabricIndex] = useState(0);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [selectedFabricOverride, setSelectedFabricOverride] =
    useState<FabricLibraryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(
    businesses[0]?.fabricCategories[0] ?? ""
  );

  const activeBusiness =
    businesses.find((business) => business.id === selectedBusiness) ??
    businesses[0];

  function handleSelectBusiness(id: BusinessId) {
    setSelectedBusiness(id);
    setSelectedFabricIndex(0);
    setSelectedTemplateIndex(0);
    setSelectedFabricOverride(null);
    const business = businesses.find((item) => item.id === id) ?? businesses[0];
    setSelectedCategory(business?.fabricCategories[0] ?? "");
  }

  return (
    <main className="min-h-screen bg-[#f7efe8] text-[#2d1f19]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-6 px-5 py-5 lg:px-8">
        {screen === "entry" ? (
          <EntryScreen
            businesses={businesses}
            selectedBusiness={selectedBusiness}
            setSelectedBusiness={handleSelectBusiness}
            onEnterDemo={() => setScreen("demo")}
          />
        ) : (
          <DemoScreen
            businesses={businesses}
            fabricLibrary={fabricLibrary}
            activeBusiness={activeBusiness}
            onSelectBusiness={handleSelectBusiness}
            onBack={() => setScreen("entry")}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedFabricOverride={selectedFabricOverride}
            setSelectedFabricOverride={setSelectedFabricOverride}
            selectedFabricIndex={selectedFabricIndex}
            setSelectedFabricIndex={setSelectedFabricIndex}
            selectedTemplateIndex={selectedTemplateIndex}
            setSelectedTemplateIndex={setSelectedTemplateIndex}
          />
        )}
      </div>
    </main>
  );
}
