import { Pool } from "./Pool";
import { TaskType } from "./TaskType";
import { Party } from "./Party";

export class WorkflowStep{
    
    public assignedPool:Pool = null;
    public assignedParty:Party = null;
    public taskType:TaskType = null;
    
    public courtOID:number = 0;
    public delayDays:number = 0;
    public documentTemplateOID:number = 0;
    public workflowOID:number = 0;
    public workflowStepOID:number = 0;
}