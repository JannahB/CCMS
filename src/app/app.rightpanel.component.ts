import { LocalStorageService } from './common/services/utility/local-storage.service';
import { TaskCount } from './common/entities/internal/TaskCount';
import { AuthenticationService } from './common/services/http/authentication.service';
import { Router } from '@angular/router';
import { GlobalState } from './common/services/state/global.state';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { SelectItem } from 'primeng/primeng';

import {AppComponent} from './app.component';
import { LookupService } from './common/services/http/lookup.service';
import { UserTask } from './common/entities/UserTask';
declare var jQuery: any;

@Component({
    selector: 'app-rightpanel',
    styleUrls: ['./app.rightpanel.component.scss'],
    template: `
      <div class="layout-rightpanel" [ngClass]="{'layout-rightpanel-active': app.rightPanelActive}" (click)="app.onRightPanelClick()">
        <div class="handle">
          <a href="#" (click)="app.onRightPanelButtonClick($event)">
            <i class="fa ui-icon-timer"></i>
          </a>
        </div>
        <div #rightPanelMenuScroller class="nano">
          <div class="nano-content right-panel-scroll-content">
            <div class="layout-rightpanel-header">
                <h1>Tasks</h1>
                <div class="tasks-day">{{today | date:'MMM d, y'}}</div>
            </div>

            <div class="layout-rightpanel-content">
              <div class="card pad-5" style="background-color: #E6EFF6;">
                <div>Filters</div>
                <div class="task-multiselect">
                  <p-multiSelect styleClass="width-full"
                      [options]="taskStatus"
                      [(ngModel)]="selectedTaskStatuses"
                      [showToggleAll]="true"
                      [filter]="false"
                      (onChange)="onFilterTasks($event)"
                      >
                      <!-- defaultLabel="Show All" -->
                  </p-multiSelect>
                </div>

                <!--
                <div class="task-date-range mt-10">
                  <p-calendar
                      [(ngModel)]="taskDateRange"
                      (onSelect)="onTaskDateSelected($event)"
                      inputStyleClass="width-full"
                      showButtonBar="true"
                      selectionMode="range"
                      readonlyInput="true"
                      [showIcon]="true"
                      appendTo="body"
                      placeholder="select date or range">
                      <ng-template pTemplate="date" let-date>
                          <span [ngStyle]="{backgroundColor: (isTaskOnThisDate(date)) ? '#7cc67c' : 'inherit'}"
                              style="border-radius:50%">
                                {{date.day}}
                          </span>
                          <!--
                          <span [ngStyle]="{backgroundColor: (date.day < 21 && date.day > 10) ? '#7cc67c' : 'inherit'}"
                              style="border-radius:50%">
                                {{date.day}}
                          </span>

                      </ng-template>
                  </p-calendar>
                </div> -->

                <div>
                  <button label="" type="button"
                          class="ui-button-secondary ui-button-icon-only refresh-btn inline"
                          pButton icon="ui-icon-refresh" (click)="refreshUserTasks()"></button>
                    <span class="muted-label">Showing: {{filteredUserTasks?.length}} of {{userTasks?.length}}</span>
                </div>
              </div>


              <div>
                <loading-bar [visible]="isLoadingTasks" [message]="'loading tasks...'"></loading-bar>
                <ul class="task-items" >
                  <li *ngFor="let task of filteredUserTasks" >
                  <div [ngClass]="{'overdue' : isOverdue(task)}">
                    <a href="#" (click)="gotoCase($event, task)"><p class="task-title">{{task.taskType?.name}}</p></a>
                    <a href="#" (click)="gotoCase($event, task)"><p class="task-subtitle">{{task.associatedCase.caseNumber}}</p></a>
                      <i class="fa ui-icon-check task-done" *ngIf="task.doneDate"></i>
                      <i class="fa ui-icon-close"*ngIf="!task.doneDate" ></i>

                      <!-- <i class="fa ui-icon-check-box-outline-blank"*ngIf="!task.doneDate"></i> -->
                      <span class="task-date">{{ task.dueDate | date:'MMM d, y' }}</span>
                  </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
})
export class AppRightpanelComponent implements OnDestroy, AfterViewInit {


    rightPanelMenuScroller: HTMLDivElement;
    taskStatus: SelectItem[] = [
        {label:'Complete Tasks', value:1},
        {label:'Incomplete Tasks', value:2},
        {label:'Overdue Tasks', value:3}
    ];
    selectedTaskStatuses: SelectItem[];
    taskDateRange: Date[];
    today: Date = new Date();
    userTasks: UserTask[];
    filteredUserTasks: UserTask[];
    taskSubscription: Subscription;
    isLoadingTasks: boolean = false;
    currentFilter: any;

    @ViewChild('rightPanelMenuScroller') rightPanelMenuScrollerViewChild: ElementRef;

    constructor(
      public app: AppComponent,
      private router: Router,
      private lookupSvc: LookupService,
      public _state: GlobalState,
      public authSvc: AuthenticationService,
      private localStorageSvc: LocalStorageService
    ) {}


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

      if(this.authSvc.isLoggedIn) {
        this.getUserTasks();
      }
      // Now that right panel is blocked during login screen, this
      // may not be needed. Keeping it until above replacement is tested.
      // this._state.subscribe('app.loggedIn', () => {
      //   this.getUserTasks();
      // });

      this._state.subscribe('rightpanel.active', (isActive) => {
        this.getUserTasks();
      });

    }

    ngAfterViewInit() {

      this.rightPanelMenuScroller = <HTMLDivElement> this.rightPanelMenuScrollerViewChild.nativeElement;

      //REMOVES POLLING ON DB: RS
      // setTimeout(() => {
      //     jQuery(this.rightPanelMenuScroller).nanoScroller({flash: true});
      // }, 10);

      this.getUserTasks();
    }

    ngOnDestroy() {
        jQuery(this.rightPanelMenuScroller).nanoScroller({flash: true});
        if(this.taskSubscription) this.taskSubscription.unsubscribe();
    }

    refreshUserTasks(){
      this.getUserTasks(true);
      this.selectedTaskStatuses = this.taskStatus;
    }

    getUserTasks(userRefresh:boolean = false) {
      console.log("Retrieveing Staff ID", this.authSvc);
      // if we've already fetched once before then don't show loading bar
      if(!this.userTasks || userRefresh) this.isLoadingTasks = true;
      this.taskSubscription = this.lookupSvc.fetchLookup<UserTask>('FetchUserTasks').subscribe(items => {
        this.userTasks = this.filteredUserTasks = items;
        this.isLoadingTasks = false;
        if(items) {
          this.broadcastTaskCounts(items);
        }

        if(userRefresh) {
          this.selectedTaskStatuses = null;
          this.onFilterTasks( { value:  this.currentFilter } );
        }
      });

    }

    broadcastTaskCounts(userTasks: UserTask[]) {
      let taskObj = new TaskCount();
      let complete = userTasks.filter( item => item.doneDate).length;
      taskObj.totalTaskCount = userTasks.length;
      taskObj.completedTaskCount = complete;
      taskObj.incompleteTaskCount = userTasks.length - complete;
      taskObj.overdueTaskCount = this.userTasks.filter( item => this.isOverdue(item)).length;
      this._state.notifyDataChanged('userTasks.count', taskObj);
      this.taskCounts = taskObj;
    
    }

    updateCountsInLocStorage(taskCounts: TaskCount){

    }

    gotoCase(event, task:UserTask) {
      let caseId = task.associatedCase.caseOID;
      this.router.navigate(['/case-detail', caseId ]);
      event.preventDefault();
    }

    onFilterTasks(event) {
      if(!event || !event.value) return;
      // 1 = completed tasks
      // 2 = incomplete tasks
      // 3 = overdue tasks

      if(event.value.length == 0 || event.value.length == this.taskStatus.length){
        // Show All
        this.filteredUserTasks = this.userTasks;
      } else {
        let ft = [];
        if(event.value.find(itm => itm == 1))
          ft = [...ft, ...this.userTasks.filter( item => item.doneDate)];
        if(event.value.find(itm => itm == 2))
          ft = [...ft, ...this.userTasks.filter( item => !item.doneDate)];
        if(event.value.find(itm => itm == 3))
          ft = [...ft, ...this.userTasks.filter( item => this.isOverdue(item))];

        // De-Dup 'em
        this.filteredUserTasks = ft.filter( (elem, pos) =>  ft.indexOf(elem) == pos );
      }
    }

    isTaskOnThisDate(date){
      // console.log('Date', date);
      // use moment here
      return this.filteredUserTasks.findIndex( item => item.dueDate == date );
    }

    onTaskDateSelected(event) {
      console.log('onTaskDateSelected', event);

    }

    isOverdue(task:UserTask) {
      if(!task) return false;
      if(!task.dueDate) return true;
      let dueDate = new Date(task.dueDate);
      return ( !task.doneDate && dueDate.getTime() < new Date().getTime() );
    }


    dateRangeFilter(){
      let startDate
      let endDate
      this.filteredUserTasks = this.filteredUserTasks.filter(
        item => moment(item.dueDate) <= endDate && moment(item.dueDate) >= startDate
      );
    }


}
