// This is the new CaseHearing Entity using SpringBoot Framework

import { CaseHearingTimesDTO } from "./CaseHearingTimesDTO";

export class CaseHearing {
  id: number;
  courtId: number;
  caseId: number;
  courtLocationId: number;
  hearingTypeId: number;
  judicialOfficerId: number;
  days: CaseHearingTimesDTO[];
  description: string;
  location: string;

}
