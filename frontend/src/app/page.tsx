import { ShowroomApp } from "@/features/showroom/components/showroom-app";
import { getShowroomData } from "@/features/showroom/service";

export default async function Home() {
  const { businesses, fabricLibrary } = await getShowroomData();

  return <ShowroomApp businesses={businesses} fabricLibrary={fabricLibrary} />;
}
