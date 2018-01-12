import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../breadcrumb.service';

@Component({
  selector: 'app-admin-workflow',
  templateUrl: './admin-workflow.component.html',
  styleUrls: ['./admin-workflow.component.scss']
})
export class AdminWorkflowComponent implements OnInit {

  constructor( private breadCrumbSvc:BreadcrumbService) {
    this.breadCrumbSvc.setItems([
      { label: 'Admin Workflow', routerLink: ['/admin-workflow'] }
    ]);
  }

  ngOnInit() {
  }

}
