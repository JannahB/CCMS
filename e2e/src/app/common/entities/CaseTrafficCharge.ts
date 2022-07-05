import { TrafficCharge } from "./TrafficCharge";

export class CaseTrafficCharge {
  id: number;
  caseId: number;
  trafficChargeId: number;
  offenceDatetime: Date;
  offenceLocation: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleRegistration: string;
  vehicleColour: string;
  vehicleYear: number;
  citationNumber: string;
  paymentDueDate: Date;
  reasonForContest: string;
  longtitude: string;
  latitude: string;
  deleted: boolean;

  trafficCharge: TrafficCharge;
}
