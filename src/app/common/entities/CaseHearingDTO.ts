import { AssociatedCase } from './AssociatedCase';
import { Party } from './Party';
import { CourtLocation } from './CourtLocation';
import { HearingType } from './HearingType';

/**
 * This object used for saving Hearing to the Server
 * CaseHearingDTO Object Model
 * {
 *  "caseOID":"2519590102015194",
    "hearingType":"1",
    "courtLoc":"1",
    "judicialOfficer":"2",
    "startDateTime":"2017-04-01 09:00",
    "endDateTime":"2017-04-01 14:00",
    "description":"testing add case hearing.\n\nWith line breaks."
  }
 */
export class CaseHearingDTO {

  // associatedCase: AssociatedCase;
  // courtOID: string;
  caseOID: string;
  courtLoc: string;      // locationOID
  description: string;          // "text"
  endDateTime: string;          // "2017-04-01 14:00"
  hearingType: string;          // == hearingTypeOID
  judicialOfficer: string;      // == partyOID
  startDateTime: string;        // "2017-04-01 14:00"

}
