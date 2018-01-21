import { JudicialOfficer } from "./JudicialOfficer";

export class JudicialAssignment {
    public judicialAssignmentOID:number;
    public caseOID:number;
    public judicialOfficial:JudicialOfficer;
    public startDate:Date;
    public endDate:Date;
}