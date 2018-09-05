import { CaseHearingTimesDTO } from "./CaseHearingTimesDTO";
import { CourtLocation } from './CourtLocation';
import { JudicialOfficer } from './JudicialOfficer';
import { HearingType } from './HearingType';

// This is the new CaseHearing Entity using SpringBoot Framework
export class CaseHearing {
  id: number = null;
  courtId: number = 0;
  caseId: number = 0;
  courtLocationId: number = 0;
  hearingTypeId: number = 0;
  judicialOfficerId: number;
  days: CaseHearingTimesDTO[] = [];
  description: string = '';
  location: string = '';

  // Transient Properties
  hearingType: HearingType;
  judicialOfficer: JudicialOfficer;
  hearingLocation: CourtLocation;
  hearingStartDateTime: Date = new Date();
  hearingEndDateTime: Date = new Date();

}
