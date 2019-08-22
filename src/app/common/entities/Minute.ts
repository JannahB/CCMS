
import { LookupEntity } from "./base/lookup-entity";
import { TempHearing } from "./TempHearing";

export class Minute extends LookupEntity {

  public id: number;
  public caseId: number;
  public hearingId: number;
  public minuteDate: Date;
  public appearances: string;
  public generalMinutes: string;
  public courtOrders: string;
  public exhibits: string;
  public witnesses: string;
  public judicialOfficer: string;

  public hearing: TempHearing;

  public Minute() {
    this.appearances = null;

  }

}
