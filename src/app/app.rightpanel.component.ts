import { SelectItem } from 'primeng/primeng';
import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {AppComponent} from './app.component';
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
                        <div class="tasks-day">Friday, 5</div>
                    </div>

                    <div class="layout-rightpanel-content">
                        <div class="card pad-5" style="background-color: #E6EFF6;">
                            <div>Filters</div>
                            <div class="muted-label">Showing: 12 of 28</div>
                            <div class="task-multiselect">
                                <p-multiSelect styleClass="width-full"
                                    [options]="tasks" 
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
                        
                        <ul class="task-items">
                            <li>
                                <a href=""><p class="task-title">Conduct Hearing Process</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-136-2017-1</p></a>
                                <i class="fa ui-icon-check task-done"></i>
                                <span class="task-date">Jan 24, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Allocate Courtroom</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-136-2017-1</p></a>
                                <i class="fa ui-icon-check task-done"></i>
                                <span class="task-date">Jan 24, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Conduct Hearing Process</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-137-2017-1</p></a>
                                <i class="fa ui-icon-check task-done"></i>
                                <span class="task-date">Jan 25, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Allocate Courtroom</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-137-2017-1</p></a>
                                <i class="fa ui-icon-check task-done"></i>
                                <span class="task-date">Jan 25, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Conduct Hearing Process</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-138-2017-1</p></a>
                                <i class="fa ui-icon-check-box-outline-blank"></i>
                                <span class="task-date">Jan 28, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Allocate Courtroom</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-138-2017-1</p></a>
                                <i class="fa ui-icon-check-box-outline-blank"></i>
                                <span class="task-date">Jan 28, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Conduct Hearing Process</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-136-2017-1</p></a>
                                <i class="fa ui-icon-check task-done"></i>
                                <span class="task-date">Jan 29, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Allocate Courtroom</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-136-2017-1</p></a>
                                <i class="fa ui-icon-check task-done"></i>
                                <span class="task-date">Jan 29, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Conduct Hearing Process</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-137-2017-1</p></a>
                                <i class="fa ui-icon-check-box-outline-blank"></i>
                                <span class="task-date">Jan 30, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Allocate Courtroom</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-137-2017-1</p></a>
                                <i class="fa ui-icon-check-box-outline-blank"></i>
                                <span class="task-date">Jan 30, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Conduct Hearing Process</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-138-2017-1</p></a>
                                <i class="fa ui-icon-check-box-outline-blank"></i>
                                <span class="task-date">Jan 31, 2017</span>
                            </li>
                            <li>
                                <a href=""><p class="task-title">Allocate Courtroom</p></a>
                                <a href=""><p class="task-subtitle">C-North-CH-138-2017-1</p></a>
                                <i class="fa ui-icon-check-box-outline-blank"></i>
                                <span class="task-date">Jan 31, 2017</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    `
})
export class AppRightpanelComponent implements OnDestroy, AfterViewInit {

    rightPanelMenuScroller: HTMLDivElement;
    tasks: SelectItem[] = [
        {label:'Complete', value:1},
        {label:'Incomplete', value:2}
    ];
    selectedTasks: SelectItem[];
    taskDateRange: Date[];

    @ViewChild('rightPanelMenuScroller') rightPanelMenuScrollerViewChild: ElementRef;

    constructor(public app: AppComponent) {}

    ngAfterViewInit() {
        // TODO: presetting the tasks creates 
        // this.buildSelectedTasks();
        
        this.rightPanelMenuScroller = <HTMLDivElement> this.rightPanelMenuScrollerViewChild.nativeElement;

        setTimeout(() => {
            jQuery(this.rightPanelMenuScroller).nanoScroller({flash: true});
        }, 10);
    }

    ngOnDestroy() {
        jQuery(this.rightPanelMenuScroller).nanoScroller({flash: true});
    }

    private buildSelectedTasks() {
        this.tasks.forEach(task => {
            this.selectedTasks.push(task);
        });

    }
}
