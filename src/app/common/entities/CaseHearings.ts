import { CaseHearing } from "./CaseHearing";


export class CaseHearings {

  caseNumber: string;
  caseOID: number;
  hearings: CaseHearing[]; // NOTE: this is called caseHearings from the server; requested Aaron name this array to hearings

}
