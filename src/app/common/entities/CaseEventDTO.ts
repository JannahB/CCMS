import { CaseDocument } from "./CaseDocument";
import { Party } from "./Party";
import { EventType } from "./EventType";
import { DocTemplate } from "./DocTemplate";
import { LookupEntity } from "./base/lookup-entity";

export class CaseEventDTO extends LookupEntity {
  ID: number;
  caseId: number;
  courtId: number;
  description: string;
  documentId: CaseDocument;
  durationTimeMin: number;
  eventDate: Date;
  eventTypeId: number;
  partyId: number;
  initiatedByPartyOid: number;
  docTemplate: DocTemplate;
  eventShortcutCode: string;
}
