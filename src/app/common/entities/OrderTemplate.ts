import { LookupEntity } from "./base/lookup-entity";

export class OrderTemplate extends LookupEntity {
  id: number;
  name: string;
  outcome: string;
  template: string;
  fineAmount: boolean;
  dueDate: boolean;
  csLocation: boolean;
  numberOfHours: boolean;
  defaultTerms: boolean;
  timePeriod: boolean;
  bondAmount: boolean;
  frequency: boolean;
  numberOfTimes: boolean;
  disqualified: boolean;
  revoked: boolean;
}
