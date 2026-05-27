import type { BusinessConfig, FabricLibraryItem } from "./types";

export function getBusinessById(
  businesses: BusinessConfig[],
  businessId: string
) {
  return businesses.find((business) => business.id === businessId) ?? null;
}

export function listFabricsByBusiness(
  fabricLibrary: FabricLibraryItem[],
  businessId: string
) {
  return fabricLibrary.filter((item) => item.business === businessId);
}

export function listFabricsByBusinessAndCategory(
  fabricLibrary: FabricLibraryItem[],
  businessId: string,
  category: string
) {
  return fabricLibrary.filter(
    (item) => item.business === businessId && item.category === category
  );
}

export function getFabricById(
  fabricLibrary: FabricLibraryItem[],
  fabricId: string
) {
  return fabricLibrary.find((item) => item.id === fabricId) ?? null;
}
