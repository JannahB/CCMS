import { CaseApplicant } from '../../common/entities/CaseApplicant';

export class CaseApplication {
    
    //These variables are sent to the server
    caseApplicationOID: number = 0;
    courtOID: number = 0;   
    caseOID: number = 0;   
    caseApplicationNumber: string = "";
    caseApplicationType: number = 0;
    caseApplicationStatus: number = 0;
    caseApplicationStartDate: Date = null;
    caseApplicationEndDate: Date = null;
    caseApplicationRole: number = 0;   

    // This is populated when an application is created, fetched and saved.
    caseApplicants: CaseApplicant [] = []; 

    //These values are not send to the server
    //They are used to display information in the UI
    numOfCaseApplications: number = 0;
    caseNumberDisplay: string = "";
    caseApplicationTypeDisplay: string = ""; 
    caseApplicationStatusDisplay: string = "Active";
    caseApplicationRoleDisplay: string = "";
        
    

    
 }
