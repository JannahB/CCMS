import { CaseDocument } from './CaseDocument';
import { Party } from './Party';
import { EventType } from './EventType';

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

}