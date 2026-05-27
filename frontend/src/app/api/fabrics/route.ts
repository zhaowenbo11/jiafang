import { NextResponse } from "next/server";
import { fabricLibrary } from "@/features/showroom/data";
import {
  listFabricsByBusiness,
  listFabricsByBusinessAndCategory,
} from "@/features/showroom/catalog";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const business = url.searchParams.get("business") ?? "";
  const category = url.searchParams.get("category") ?? "";

  const data = business
    ? category
      ? listFabricsByBusinessAndCategory(fabricLibrary, business, category)
      : listFabricsByBusiness(fabricLibrary, business)
    : fabricLibrary;

  return NextResponse.json({
    business: business || null,
    category: category || null,
    total: data.length,
    fabrics: data,
  });
}
