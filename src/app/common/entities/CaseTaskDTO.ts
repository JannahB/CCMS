import { Time } from "@angular/common";

/*
   This is used to send CaseTask to the server
*/

export class CaseTaskDTO {

  taskOID:string = '';
  caseOID:string = '';          // "5344330627072059"
  taskDetails:string = '';      // "Something..."
  taskDueDate:string = '';      // "2018-01-31"
  taskParty:string = '';        // "2"
  taskPriorityCode:string = ''; // "1"
  taskStaffPool:string = '';    // "501"
  taskType:string = '';         // "832960474289411"
  taskDoneDate:string = '';         // "2018-01-31"
  taskDocumentTemplateOID:string = '';  // "5344330627072059"
  taskCompleted:string = 'false';   //true or false
  taskPriorityDesc:string = '';
}
