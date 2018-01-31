import { Party } from "./Party";
import { CasePartyRole } from "./CasePartyRole";

export class CaseParty {
    public caseParty:Party = new Party();
    public role:CasePartyRole = new CasePartyRole();
    public startDate:any = null; //'any' so incoming date and outgoing date can be used by same property
    public endDate:any = null;   //Maybe needs to be a date?

}
