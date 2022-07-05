import { CaseDocument } from './CaseDocument';
import { Party } from './Party';
import { EventType } from './EventType';
import { DocTemplate } from './DocTemplate';

export class CaseEvent {
  caseEventOID: number; 
  caseOID: number;
  courtOID: number; 
  description: string;
  document: CaseDocument; 
  durationTimeMin: number; 
  enteringParty: Party;
  eventDate: Date;
  eventType: EventType;
  initiatedByParty: Party;
  //documentTemplateOID: number;
  docTemplate:DocTemplate;

}