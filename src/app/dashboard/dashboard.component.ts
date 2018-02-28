import { TaskCount } from './../common/entities/internal/TaskCount';
import { GlobalState } from './../common/services/state/global.state';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import { ToastService } from '../common/services/utility/toast.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectedCourt: any;
  suggestionTypes: SelectItem[] = [{label:'Ask a Question', value: 1}, {label:'Make a Comment', value: 2},{label:'Suggest a Feature', value: 3}, {label:'Report an Issue', value: 4}]
  totalTaskCount: number;
  completedTaskCount: number;
  incompleteTaskCount: number;

  constructor(
    public app: AppComponent,
    private breadCrumbSvc:BreadcrumbService,
    private toastSvc:ToastService,
    private _state: GlobalState
  ) {
    this.breadCrumbSvc.setItems([]);
  }

  ngOnInit() {

    this._state.subscribe('userTasks.count', (counts:TaskCount) => {
      this.totalTaskCount = counts.totalTaskCount;
      this.completedTaskCount = counts.completedTaskCount;
      this.incompleteTaskCount = counts.incompleteTaskCount;
    })
  }

  makeToast() {
    this.toastSvc.showInfoMessage('Thank you for submitting your suggestion. ', 'Submitted');
  }
}
