import { Router } from '@angular/router';
import { GlobalState } from './common/services/state/global.state';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';

import {AppComponent} from './app.component';
import { LookupService } from './common/services/http/lookup.service';
import { UserTask } from './common/entities/UserTask';
declare var jQuery: any;

@Component({
    selector: 'app-rightpanel',
    styleUrls: ['./app.rightpanel.component.scss'],
    template: `
      <div class="layout-rightpanel" [ngClass]="{'layout-rightpanel-active': app.rightPanelActive}" (click)="app.onRightPanelClick()">
        <div #rightPanelMenuScroller class="nano">
          <div class="nano-content right-panel-scroll-content">
            <div class="layout-rightpanel-header">
                <h1>Tasks</h1>
                <div class="tasks-day">{{today | date:'MMM d, y'}}</div>
            </div>

            <div class="layout-rightpanel-content">
              <div class="card pad-5" style="background-color: #E6EFF6;">
                <div>Filters</div>
                <div class="muted-label">Showing: 12 of 28</div>
                <div class="task-multiselect">
                  <p-multiSelect styleClass="width-full"
                      [options]="taskStatus"
                      [(ngModel)]="selectedTasks"
                      [showToggleAll]="true"
                      [filter]="false"
                      defaultLabel="filter completeness"
                      >
                  </p-multiSelect>
                </div>
                <div class="task-date-range mt-10">
                  <p-calendar
                      [(ngModel)]="taskDateRange"
                      inputStyleClass="width-full"
                      showButtonBar="true"
                      selectionMode="range"
                      readonlyInput="true"
                      [showIcon]="true"
                      appendTo="body"
                      placeholder="select date or range"
                      >
                      <ng-template pTemplate="date" let-date>
                          <span
                              [ngStyle]="{backgroundColor: (date.day < 21 && date.day > 10) ? '#7cc67c' : 'inherit'}"
                              style="border-radius:50%">{{date.day}}

                          </span>
                      </ng-template>
                  </p-calendar>
                </div>
              </div>

              <div>
                <loading-bar [visible]="isLoadingTasks" [message]="'loading tasks...'"></loading-bar>
                <ul class="task-items">
                  <li *ngFor="let task of userTasks">
                    <a (click)="gotoCase($event, task)"><p class="task-title">{{task.taskType?.name}}</p></a>
                    <a (click)="gotoCase($event, task)"><p class="task-subtitle">{{task.associatedCase.caseNumber}}</p></a>
                      <i class="fa ui-icon-check task-done" *ngIf="task.doneDate"></i>
                      <i class="fa ui-icon-check-box-outline-blank"*ngIf="!task.doneDate"></i>
                      <span class="task-date">{{ task.dueDate | date:'MMM d, y' }}</span>
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
        {label:'Complete', value:1},
        {label:'Incomplete', value:2}
    ];
    selectedTasks: SelectItem[];
    taskDateRange: Date[];
    today: Date = new Date();
    userTasks: UserTask[];
    taskSubscription: Subscription;
    isLoadingTasks: boolean = false;

    @ViewChild('rightPanelMenuScroller') rightPanelMenuScrollerViewChild: ElementRef;

    constructor(
      public app: AppComponent,
      private router: Router,
      private lookupSvc: LookupService,
      private _state: GlobalState
    ) {}

    ngOnInit() {
      this._state.subscribe('app.loggedIn', () => {
        this.getUserTasks();
      });

      this._state.subscribe('rightpanel.active', (isActive) => {
        this.getUserTasks(true);
      });

    }

    ngAfterViewInit() {
      this.rightPanelMenuScroller = <HTMLDivElement> this.rightPanelMenuScrollerViewChild.nativeElement;

      setTimeout(() => {
          jQuery(this.rightPanelMenuScroller).nanoScroller({flash: true});
      }, 10);
    }

    ngOnDestroy() {
        jQuery(this.rightPanelMenuScroller).nanoScroller({flash: true});
        if(this.taskSubscription) this.taskSubscription.unsubscribe();
    }

    getUserTasks(backgroundFetch?:boolean) {
      this.isLoadingTasks = !backgroundFetch;
      this.taskSubscription = this.lookupSvc.fetchLookup<UserTask>('FetchUserTasks').subscribe(items => {
        this.userTasks = items;
        this.isLoadingTasks = false;
      });
    }

    gotoCase(event, task:UserTask) {
      let caseId = task.associatedCase.caseOID;
      this.router.navigate(['/case-detail', caseId ]);
    }


    // private buildSelectedTasks() {
    //     this.tasks.forEach(task => {
    //         this.selectedTasks.push(task);
    //     });
    // }
}
