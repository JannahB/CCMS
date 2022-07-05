import { Pool } from "./Pool";
import { TaskType } from "./TaskType";
import { Party } from "./Party";

export class WorkflowStep{
    
    public assignedPool:Pool = null;
    public assignedParty:Party = null;
    public taskType:TaskType = null;
    public taskPriorityCode: number = 0; 
    public courtOID:number = 0;
    public delayMinutes:number = 0;
    public delayUnit: number = 0;
    //public delayUnitDesc:string = 'Minutes';
    public documentTemplateOID:number = 0;
    public workflowOID:number = 0;
    public workflowStepOID:number = 0;
}