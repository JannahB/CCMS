import { Court } from "./Court";
import { EventType } from "./EventType";
import { WorkflowStep } from "./WorkflowStep";

export class EventWorkflow{
    
    public court:Court;
    public description:string;
    public eventWorkflowOID:number;
    public triggeringEvent:EventType;
    public triggeringEventOID:string;
    public workflowSteps:WorkflowStep[];
}