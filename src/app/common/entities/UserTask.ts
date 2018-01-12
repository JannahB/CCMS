import { TaskType } from './TaskType';
import { Pool } from './Pool';
import { Party } from './Party';
import { DocTemplate } from './DocTemplate';
import { AssociatedCase } from './AssociatedCase';

export class UserTask {

  assignedDate: Date;
  assignedParty: Party;
  assignedPool: Pool; 
  associatedCase: AssociatedCase; 
  courtOID: number; 
  details: string; 
  docTemplate: DocTemplate;
  dueDate: Date;
  notDoneReason: string; 
  taskOID: number;  
  taskPriorityCode: number;
  taskType: TaskType;

}
