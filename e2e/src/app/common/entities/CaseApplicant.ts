export class CaseApplicant {
    
    //These variables are sent to the server
    courtID: number = 0;
    caseOID: number = 0;
    caseApplicationOID: number = 0;
    caseApplicantPartyOID: number = 0;
    caseApplicantRoleOID: number = 0;
    
    //These values are not send to the server
    //They are used to display information in the UI
    applicantName: string = ""; 
    applicantRole: string = "";

    
 }