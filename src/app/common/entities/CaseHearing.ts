import { CaseHearingTimesDTO } from "./CaseHearingTimesDTO";
import { CourtLocation } from './CourtLocation';
import { JudicialOfficer } from './JudicialOfficer';
import { HearingType } from './HearingType';

// This is the new CaseHearing Entity using SpringBoot Framework
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

  // Transient Properties
  hearingType: HearingType;
  judicialOfficer: JudicialOfficer;
  hearingLocation: CourtLocation;
  hearingStartDateTime: Date; // timestamp of first obj in days[]
  hearingEndDateTime: Date; // timestamp of first obj in days[]

}
