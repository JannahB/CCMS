import { Party } from './Party';
import { CourtLocation } from './CourtLocation';
import { HearingType } from './HearingType';

export class CaseHearing {

  caseHearingOID: number;
  caseOID: number;
  courtLoc: CourtLocation;
  courtOID: number;
  endDateTime: Date;
  hearingType: HearingType;
  judicialOfficer: Party;
  startDateTime: Date;

  description: string; //?? TODO: CONFIRM if this on obj coming from server

}
