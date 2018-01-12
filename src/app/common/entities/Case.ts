import { LookupEntity } from './base/lookup-entity';
import { CaseDocument } from './CaseDocument';
import { CaseEvent } from './CaseEvent';
import { CaseType } from './CaseType';
import { CasePhase } from './CasePhase';
import { Court } from './Court';
import { Party } from './Party';
import { CaseStatus } from './CaseStatus';
import { CaseTask } from './CaseTask';
import { CaseHearings } from './CaseHearings';
import { CaseCharge } from './CaseCharge';

export class Case extends LookupEntity {

  // Following 5 properties are not no an "AssociatedCase"
  caseCaption: string; 
  caseFilingDate: Date;
  casePhase: CasePhase;
  caseStatus: CaseStatus;
  caseType: CaseType;

  caseCharges: CaseCharge[]; 
  caseDocs: CaseDocument[];
  caseEvents: CaseEvent[];

  caseHearings: CaseHearings[];      // Needs modifications on server side to work properly //
  
  caseNumber: string; 
  caseOID: number; 
  caseParties: Party[];
  caseTasks: CaseTask[]; 
  caseWeight: number; 
  court: Court;
  judicialAssignments: any[];        // Entity NEEDED //
  searchCasePartyRoleOID: number; 
  
}