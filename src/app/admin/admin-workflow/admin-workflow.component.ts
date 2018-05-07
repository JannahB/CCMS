import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../breadcrumb.service';
import { CaseEvent } from './../../common/entities/CaseEvent';
import { LookupService } from '../../common/services/http/lookup.service';
import { EventType } from '../../common/entities/EventType';
import { AdminDataService } from '../../common/services/http/admin-data.service';
import { EventWorkflow } from '../../common/entities/EventWorkflow';
import { Observable } from 'rxjs/Observable';
import { TaskType } from '../../common/entities/TaskType';
import { DocTemplate } from '../../common/entities/DocTemplate';
import { ToastService } from '../../common/services/utility/toast.service';
import { PartyService } from '../../common/services/http/party.service';
import { Party } from '../../common/entities/Party';
import { WorkflowStep } from '../../common/entities/WorkflowStep';
import { Pool } from '../../common/entities/Pool';

@Component({
  selector: 'app-admin-workflow',
  templateUrl: './admin-workflow.component.html',
  styleUrls: ['./admin-workflow.component.scss']
})
export class AdminWorkflowComponent implements OnInit {

  showLoadingBar:boolean = false;

  eventTypes:EventType[];
  taskTypes:TaskType[];
  documentTemplates:DocTemplate[];
  staffPools:Pool[];
  parties:Party[];

  selectedEvent: EventType;
  selectedEventWorkflow:EventWorkflow = null;
  workflowSteps: WorkflowStep[];
  selectedStep: WorkflowStep;

  showWorkflowStepModal:boolean = false;
  showNewTaskTypeModal:boolean = false;

  taskName:string = "";
  taskDescription:string = "";

  showDeleteWorkflowStepConfirmation:boolean = false;
  selectedWorkflowStepToDelete:WorkflowStep = null;

  get assignedPartyOrPool():any{
    if(!this.selectedStep){
      return null;
    }

    if(this.selectedStep.assignedParty){
      return this.selectedStep.assignedParty;
    }

    if(this.selectedStep.assignedPool){
      return this.selectedStep.assignedPool;
    }

    return null;
  }

  set assignedPartyOrPool(value:any){
    if(!this.selectedStep){
      return;
    }

    if(value.partyOID){
      this.selectedStep.assignedParty = value;
      this.selectedStep.assignedPool = null;
    }

    if(value.poolOID){
      this.selectedStep.assignedPool = value;
      this.selectedStep.assignedParty = null;
    }
  }

  constructor( 
    private breadCrumbSvc:BreadcrumbService,
    private lookupService:LookupService,
    private adminDataService:AdminDataService,
    private toastService:ToastService,
    private partyService:PartyService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Admin Workflow', routerLink: ['/admin-workflow'] }
    ]);
  }

  ngOnInit() {

    this.showLoadingBar = true;

    let eventTypeObservable:Observable<EventType[]> = this.lookupService
      .fetchLookup<EventType>("FetchEventType");

    let taskTypeObservable:Observable<TaskType[]> = this.lookupService
      .fetchLookup<TaskType>('FetchTaskType');

    let documentTemplateObservable:Observable<DocTemplate[]> = this.lookupService
      .fetchLookup<DocTemplate>('FetchDocumentTemplate');

    let staffPoolObservable:Observable<Pool[]> = this.lookupService
      .fetchLookup<Pool>('FetchStaffPool');

    let partyObservable:Observable<Party[]> = this.partyService
      .fetchAny({ courtUser: "true"});

    Observable.forkJoin(
      eventTypeObservable,
      taskTypeObservable,
      documentTemplateObservable,
      staffPoolObservable,
      partyObservable
    ).subscribe( 
      results => {
        this.eventTypes = results[0];
        this.taskTypes = results[1];
        this.documentTemplates = results[2];
        this.staffPools = results[3];
        this.parties = results[4];

        this.showLoadingBar = false;
      },
      error => {
        this.showLoadingBar = false;
        this.toastService
          .showErrorMessage("An error occurred");
      }
    );
  }

  eventTypeOnChange(event){
    this.showLoadingBar = true;

    this.adminDataService
      .fetchEventWorkflow(this.selectedEvent.eventTypeOID)
      .subscribe(
        eventWorkflow => {
          this.selectedEventWorkflow = eventWorkflow;
          this.sortWorkflowSteps();

          this.showLoadingBar = false;
        },
        error => {
          this.showLoadingBar = false;
          this.toastService
            .showErrorMessage("An error occurred");
        }
      );
  }

  stepOnRowSelect(event){
    // TODO: implement
  }

  onAddStep() {
    this.selectedStep = new WorkflowStep();
    
    this.showWorkflowStepModal = true;
  }

  saveWorkflowStep(){
    if(!this.selectedEventWorkflow.workflowSteps){
      this.selectedEventWorkflow.workflowSteps = [];
    }
    this.selectedEventWorkflow.workflowSteps.push(this.selectedStep);
    this.selectedEventWorkflow.workflowSteps = this.selectedEventWorkflow.workflowSteps.copy();
    this.sortWorkflowSteps();
    this.showWorkflowStepModal = false;
  }

  deleteWorkflowEventRequest(event) {
    // TODO: implement
  }

  deleteWorkflowStepRequest(step){
    this.showDeleteWorkflowStepConfirmation = true;
    this.selectedWorkflowStepToDelete = step;
  }

  confirmDeleteWorkflowStep(){
    this.selectedEventWorkflow
      .workflowSteps
      .remove(this.selectedWorkflowStepToDelete);

    this.selectedEventWorkflow.workflowSteps = this.selectedEventWorkflow.workflowSteps.copy();
    this.sortWorkflowSteps();
    this.clearSelectedWorkflowStep();
  }

  clearSelectedWorkflowStep(){
    this.selectedWorkflowStepToDelete = null;
    this.showDeleteWorkflowStepConfirmation = false;
  }

  cancelWorkflowEdit() {
    this.showWorkflowStepModal = false;
  }

  saveWorkflow(){
    this.showLoadingBar = true;

    this.adminDataService
      .saveEventWorkflow(this.selectedEventWorkflow)
      .subscribe(
        workflow => {
          this.selectedEventWorkflow = workflow;
          this.sortWorkflowSteps();
          this.showLoadingBar = false;
          this.toastService.showSuccessMessage("Workflow Saved");
        },
        error => {
          this.toastService.showErrorMessage("Error saving workflow");
          this.showLoadingBar = false;
        }
      );
  }

  documentSelected(event:any):void{
    this.selectedStep.documentTemplateOID = event.value.documentTemplateOID;
  }

  saveNewTaskType(){
    let taskType = new TaskType();

    taskType.name = this.taskName;
    taskType.description = this.taskDescription;

    this.showLoadingBar = true;

    this.adminDataService
      .saveTaskType(taskType)
      .subscribe( 
        taskType => {
          this.taskTypes.push(taskType);
          this.taskTypes = this.taskTypes.copy();
          this.showLoadingBar = false;
          this.clearTaskType();
          this.selectedStep.taskType = taskType;
        },
        error => {
          this.toastService.showErrorMessage("Error saving task type");
          this.showLoadingBar = false;
        }
      )
  }

  clearTaskType(){
    this.taskName = "";
    this.taskDescription = "";

    this.showNewTaskTypeModal = false;
  }

  private sortWorkflowSteps(){
    if(!this.selectedEventWorkflow || !this.selectedEventWorkflow.workflowSteps){
      return;
    }

    this.selectedEventWorkflow.workflowSteps = this.selectedEventWorkflow
      .workflowSteps
      .sort(
        (step1, step2) => {
          return step1.delayDays - step2.delayDays;
        }
      )
  }
}
