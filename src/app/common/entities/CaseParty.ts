import { Party } from "./Party";
import { CasePartyRole } from "./CasePartyRole";

export class CaseParty {
    public caseParty:Party = new Party();
    public role:CasePartyRole = new CasePartyRole();
    public startDate:string = "";//Maybe needs to be a date?
    public endDate:string = "";//Maybe needs to be a date?

}