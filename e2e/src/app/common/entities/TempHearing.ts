import { CaseHearingTimesDTO } from "./CaseHearingTimesDTO";
import { CourtLocation } from './CourtLocation';
import { JudicialOfficer } from './JudicialOfficer';
import { HearingType } from './HearingType';

// This is the new TempHearing Entity using SpringBoot Framework
export class TempHearing {
  id: number = null;
  courtId = 0;
  caseId = 0;
  courtLocationId = 0;
  hearingTypeId = 0;
  judicialOfficerId = 0;
  description = '';
  location = '';
  hearingDate = new Date();
  startDateTime = new Date();
  endDateTime = new Date();


  // Transient Properties
  hearingType: HearingType;
  judicialOfficer: JudicialOfficer;
  hearingLocation: CourtLocation;
  hearingName: string;
}
