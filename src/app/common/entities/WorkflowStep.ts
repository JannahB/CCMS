import { Pool } from "./Pool";
import { TaskType } from "./TaskType";
import { Party } from "./Party";

export class WorkflowStep{
    public assignedPool:Pool;
    public assignedParty:Party;
    public courtOID:number;
    public delayDays:number;
    public documentTemplateOID:number;
    public taskType:TaskType;
    public workflowOID:number;
    public workflowStepOID:number;
}