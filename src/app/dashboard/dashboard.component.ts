import { LocalStorageService } from './../common/services/utility/local-storage.service';
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
  overdueTaskCount: number;

  constructor(
    public app: AppComponent,
    private breadCrumbSvc:BreadcrumbService,
    private toastSvc:ToastService,
    private _state: GlobalState,
    private localStorageSvc: LocalStorageService
  ) {
    this.breadCrumbSvc.setItems([]);
  }

  private _taskCounts: TaskCount;
  public get taskCounts(){
    if(!this._taskCounts) {
      this._taskCounts = this.localStorageSvc.getValue('TASK_COUNTS');
    }
    return this._taskCounts;
  }
  public set taskCounts(tc:TaskCount){
    this.localStorageSvc.setValue('TASK_COUNTS', tc);
    this._taskCounts = tc;
  }


  ngOnInit() {

    this.taskCounts = new TaskCount();

    this._state.subscribe('userTasks.count', (counts:TaskCount) => {
      this.totalTaskCount = counts.totalTaskCount;
      this.completedTaskCount = counts.completedTaskCount;
      this.incompleteTaskCount = counts.incompleteTaskCount;
      this.overdueTaskCount = counts.overdueTaskCount;
    })

    this.totalTaskCount = this.taskCounts.totalTaskCount | 0;
    this.completedTaskCount = this.taskCounts.completedTaskCount | 0;
    this.incompleteTaskCount = this.taskCounts.incompleteTaskCount | 0;
    this.overdueTaskCount = this.taskCounts.overdueTaskCount | 0;
  }

  makeToast() {
    this.toastSvc.showInfoMessage('Thank you for submitting your suggestion. ', 'Submitted');
  }
}
