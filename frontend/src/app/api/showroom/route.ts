import { NextResponse } from "next/server";
import { getShowroomData } from "@/features/showroom/service";

export async function GET() {
  const { businesses, fabricLibrary } = await getShowroomData();

  return NextResponse.json({
    businesses,
    fabrics: fabricLibrary,
  });
}
