import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../breadcrumb.service';
import { CaseEvent } from './../../common/entities/CaseEvent';

@Component({
  selector: 'app-admin-workflow',
  templateUrl: './admin-workflow.component.html',
  styleUrls: ['./admin-workflow.component.scss']
})
export class AdminWorkflowComponent implements OnInit {

  eventTypes:CaseEvent[];
  selectedEvent: CaseEvent;
  workflowSteps: any[];
  selectedStep: any;

  constructor( private breadCrumbSvc:BreadcrumbService) {
    this.breadCrumbSvc.setItems([
      { label: 'Admin Workflow', routerLink: ['/admin-workflow'] }
    ]);
  }

  ngOnInit() {
  }

  eventTypeOnChange(event){
    // TODO: implement
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
