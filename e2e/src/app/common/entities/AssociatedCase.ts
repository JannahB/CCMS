import { Court } from './Court';
import { Party } from './Party';

export class AssociatedCase {

  caseCharges: any[];                // Entity NEEDED //
  caseDocs: any[];                   // Entity NEEDED //
  caseEvents: any[];                 // Entity NEEDED //
  caseHearings: any[];               // Entity NEEDED //
  caseNumber: string; 
  caseOID: number; 
  caseParties: Party[];
  caseTasks: any[];                  // Entity NEEDED //
  caseWeight: number; 
  court: Court;
  judicialAssignments: any[];        // Entity NEEDED //
  searchCasePartyRoleOID: number; 
  
}