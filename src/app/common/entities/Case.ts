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
import { CaseParty } from './CaseParty';
import { CaseHearing } from './CaseHearing';

export class Case extends LookupEntity {

  // Following 5 properties are not no an "AssociatedCase"
  caseCaption: string = "";
  caseFilingDate: Date = null;
  casePhase: CasePhase = null;
  caseStatus: CaseStatus = null;
  caseType: CaseType = null;

  caseCharges: CaseCharge[] = [];
  caseDocs: CaseDocument[] = [];
  caseEvents: CaseEvent[] = [];

  caseHearings: CaseHearing[] = [];      // Needs modifications on server side to work properly //

  caseNumber: string = "";
  caseOID: number = 0;
  caseParties: CaseParty[] = [];
  caseTasks: CaseTask[] = [];
  caseWeight: number = 0;
  court: Court = null;
  judicialAssignments: any[] = [];        // Entity NEEDED //
  searchCasePartyRoleOID: number = 0;

  //RS
  prevCaseNumber: string = "";
  caseNotes: string = "";
  //RS

  }
