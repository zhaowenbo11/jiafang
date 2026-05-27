import { businesses, fabricLibrary } from "./data";

export type ShowroomData = {
  businesses: typeof businesses;
  fabricLibrary: typeof fabricLibrary;
};

export async function getShowroomData(): Promise<ShowroomData> {
  return {
    businesses,
    fabricLibrary,
  };
}
