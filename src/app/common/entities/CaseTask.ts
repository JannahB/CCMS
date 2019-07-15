import { TaskType } from './TaskType';
import { Pool } from './Pool';
import { Party } from './Party';
import { AssociatedCase } from './AssociatedCase';
import { DocTemplate } from './DocTemplate';
import { Time } from '@angular/common';

export class CaseTask {

  assignedDate: Date = null;
  assignedParty: Party = new Party();
  assignedPool: Pool = new Pool();
  associatedCase: AssociatedCase = new AssociatedCase();
  courtOID: number = null;
  taskDetails: string = '';
  docTemplate: DocTemplate = new DocTemplate();
  taskDueDate: Date = null;
  taskDoneDate: Date = null;
  notDoneReason: string = '';
  taskOID: number = 0;
  taskDocumentTemplateOID: number = 0;
  taskPriorityCode: number = 0;
  taskPriorityDesc: string = '';
  taskType: TaskType = new TaskType();
  taskCheckedOut: boolean = false;
  taskCompleted: boolean = false;
}
