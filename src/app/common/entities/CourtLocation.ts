import { CalFacilityTime } from "./CalFacilityTime";

export class CourtLocation {

  courtOID: number;
  locationID: string;
  locationOID: number;
  locationName: string;
  description: string;

  // these added to support correct court-location entity
  id: number;
  courtId: number;
  courtroom: string;
  days: CalFacilityTime[];
}
