import { Pool } from "./Pool";
import { TaskType } from "./TaskType";

export class WorkflowStep{
    public assignedPool:Pool;
    public courtOID:number;
    public delayDays:number;
    public documentTemplateOID:number;
    public taskType:TaskType;
    public workflowOID:number;
    public workflowStepOID:number;
}