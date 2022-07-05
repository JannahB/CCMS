import { CaseHearingDeprecated } from "./CaseHearingDeprecated";


export class CaseHearings {

  caseNumber: string;
  caseOID: number;
  hearings: CaseHearingDeprecated[]; // NOTE: this is called caseHearings from the server; requested Aaron name this array to hearings

}
