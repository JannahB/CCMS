import { LookupEntity } from './base/lookup-entity';
import { CaseDocument } from './CaseDocument';
import { CaseEvent } from './CaseEvent';
import { CaseType } from './CaseType';
import { CaseSubType } from './CaseSubType';
import { CasePhase } from './CasePhase';
import { CaseDispositionType } from './CaseDispositionType';
import { Court } from './Court';
import { CaseStatus } from './CaseStatus';
import { CaseTask } from './CaseTask';
import { DocumentType } from './DocumentType';
import { CaseCharge } from './CaseCharge';
import { CaseParty } from './CaseParty';
import { CaseHearingDeprecated } from './CaseHearingDeprecated';
import { CaseApplication } from '../../common/entities/CaseApplication';
import { CaseApplicant } from '../../common/entities/CaseApplicant';
import { CasePayment } from '../../common/entities/CasePayment';
import { PaymentDisbursementDetails } from '../../common/entities/PaymentDisbursementDetails';
import { Party } from '../../common/entities/Party';

export class Case extends LookupEntity {

  // Following 5 properties are not no an "AssociatedCase"
  caseCaption: string = "";
  initDocumentType: string = "";
  initDocType: DocumentType = null;
  caseFilingDate: Date = null;
  casePhase: CasePhase = null;
  //caseSubType: CaseSubType = null;
  caseStatus: CaseStatus = null;
  caseType: CaseType = null;
  
  caseCharges: CaseCharge[] = [];
  caseDocs: CaseDocument[] = [];
  caseEvents: CaseEvent[] = [];
  //caseSubTypes: CaseSubType[] = [];

  caseHearings: CaseHearingDeprecated[] = [];      // Needs modifications on server side to work properly //

  caseNumber: string = "";
  caseOID: number = 0;
  caseParties: CaseParty[] = [];
  caseTasks: CaseTask[] = [];
  
  caseApplications: CaseApplication[] = []; // used to capture all applications for a case
  caseApplicants: CaseApplicant [] = []; //used to capture all applicants on a case

  casePayments: CasePayment[] = []; // used to capture all applications for a case
  casePaymentsDetails: PaymentDisbursementDetails [] = []; //used to capture all applicants on a case

  caseWeight: number = 0;
  sequenceNumber: number = 0;
  sealIndicator: number = 0;
  unsealRestriction : number = 0;
  court: Court = null;
  judicialAssignments: any[] = [];        // Entity NEEDED //
  searchCasePartyRoleOID: number = 0;

  prevCaseNumber: string = "";
  casePrevNumber: string = "";
  caseNotes: string = "";
  charges: string = "";

  courtOfAppealNumber: string = "";

  caseDispositionType: CaseDispositionType = null;
  caseDispositionDate: Date = null;
  authorizedAccessCaseParties: Party[] = []; 

  }
