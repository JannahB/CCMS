import { CaseApplicant } from '../../common/entities/CaseApplicant';
import { CaseApplicationType } from '../../common/entities/CaseApplicationType';

export class CaseApplication {
    
    //These variables are sent to the server
    caseApplicationOID: number = 0;
    courtOID: number = 0;   
    caseOID: number = 0;   
    caseApplicationNumber: string = "";
    caseApplicationType: number = 0;
    caseApplicationStatus: string = "";
    caseApplicationStartDate: Date = null;
    caseApplicationEndDate: Date = null;
    dateOfMarriage: Date = null;
    aomStreetName: string = ""; 
    aomCityName: string = ""; 
    aomCountryName: string = ""; 
    caseApplicationRole: number = 0;
    caseApplicationObjType: CaseApplicationType = null;    
    caseApplicants: CaseApplicant [] = []; // This is populated when an application is created, fetched and saved.

    //These values are not send to the server
    //They are used to display information in the UI
    numOfCaseApplications: number = 0;
    caseNumberDisplay: string = "";
    caseApplicationTypeDisplay: string = ""; 
    caseApplicationStatusDisplay: string = "";
    caseApplicationRoleDisplay: string = "";    
 }
