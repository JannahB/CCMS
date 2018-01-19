import { CasePhase } from "./CasePhase";


export class CaseType {

  caseTypeOID: number;
  name: string;
  shortName: string;
  description: string;
  casePhases: CasePhase[];
  courtOID: number;

}
