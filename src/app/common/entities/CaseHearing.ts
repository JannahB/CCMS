import { AssociatedCase } from './AssociatedCase';
import { Party } from './Party';
import { CourtLocation } from './CourtLocation';
import { HearingType } from './HearingType';

export class CaseHearing {

  associatedCase: AssociatedCase;
  caseHearingOID: number;
  caseOID: number;
  courtLoc: CourtLocation;
  courtOID: number;
  description: string;
  endDateTime: Date;
  hearingType: HearingType;
  judicialOfficer: Party;
  startDateTime: Date;

}
