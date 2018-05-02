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
  parties:Party[];

  selectedEvent: EventType;
  selectedEventWorkflow:EventWorkflow = null;
  workflowSteps: any[];
  selectedStep: any;

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

    let partyObservable:Observable<Party[]> = this.partyService
      .fetchAny({ courtUser: "true"});

    Observable.forkJoin(
      eventTypeObservable,
      taskTypeObservable,
      documentTemplateObservable,
      partyObservable
    ).subscribe( 
      results => {
        this.eventTypes = results[0];
        this.taskTypes = results[1];
        this.documentTemplates = results[2];
        this.parties = results[3];

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
    // TODO: implement
  }

  deleteWorkflowEventRequest(event) {
    // TODO: implement
  }

  cancelWorkflowEdit() {

  }

  saveWorkflow(){
    // TODO: implement
  }


}
