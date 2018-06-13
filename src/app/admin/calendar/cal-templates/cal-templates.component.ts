import { ToastService } from './../../../common/services/utility/toast.service';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { BreadcrumbService } from './../../../breadcrumb.service';
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DayPilot, DayPilotSchedulerComponent } from "daypilot-pro-angular";
import { CalendarService } from './../../../common/services/http/calendar.service';

import * as moment from 'moment';
import { CalTemplate } from '../../../common/entities/CalTemplate';

@Component({
  selector: 'app-cal-templates',
  templateUrl: './cal-templates.component.html',
  styleUrls: ['./cal-templates.component.scss']
})
export class CalTemplatesComponent implements OnInit {

  ngOnInit() {
    this.templates = [
      { id: 1, name: 'Standard Hours', description: 'Standard work week hours' },
      { id: 2, name: 'Short Friday', description: 'Standard hours with 1-3 on Friday' },
      { id: 3, name: 'Plus Sat Morning', description: 'Standard hours plus short Saturday' },
      { id: 4, name: 'Wednesday Exempt', description: 'Standard week minus Wed for monthly conference' }
    ];

    // Handle mat-selection-list selection change via dom element so we can DeselectAll
    this.itemsList.selectionChange.subscribe((event: MatSelectionListChange) => {
      this.itemsList.deselectAll();
      event.option.selected = true;
      this.selectedTemplate = event.option.value;
      this.copySelectedItem();
    });

    this.selectedTemplate = this.templates[0];
  }

  ngOnDestroy() {
    // if (this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }


  @ViewChild("scheduler")
  scheduler: DayPilotSchedulerComponent;

  @ViewChild(MatSelectionList)
  itemsList: MatSelectionList;

  events: any[] = [];
  templates: any[] = [];
  selectedTemplate: any;
  selectedTemplateBak: any
  selectedTemplateIdx: number;
  showDeleteItemModal: boolean = false;

  config: any = {
    viewType: "Days",
    showNonBusiness: false,
    businessBeginsHour: 8,
    businessEndsHour: 19,
    rowHeaderColumns: [
      { title: "Date" }
      // {title: "Total"}
    ],
    eventHeight: 40,
    cellWidthSpec: "Auto",
    timeHeaders: [{ "groupBy": "Hour" }, { "groupBy": "Cell", "format": "mm" }],
    scale: "CellDuration",
    cellDuration: 30,
    // days: new DayPilot.Date("2017-07-01").daysInMonth(),
    days: 7,
    startDate: "2018-01-01",
    heightSpec: "Max",
    height: 300,
    onTimeRangeSelected: args => {
      DayPilot.Modal.prompt("Create a new task:", "Available").then(function (modal) {
        var dp = args.control;
        dp.clearSelection();
        if (!modal.result) { return; }
        dp.events.add(new DayPilot.Event({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          resource: args.resource,
          text: modal.result
        }));
      });
    },
    onBeforeRowHeaderRender: args => {
      let duration = args.row.events.totalDuration();
      if (duration.totalSeconds() === 0) {
        return;
      }

      let str;
      if (duration.totalDays() >= 1) {
        str = Math.floor(duration.totalHours()) + ":" + duration.toString("mm");
      }
      else {
        str = duration.toString("H:mm");
      }

      args.row.columns[0].html = str + " hours";
    },
    onBeforeEventRender: args => {
      var duration = new DayPilot.Duration(args.data.start, args.data.end);
      args.data.areas = [
        { right: 2, top: 6, height: 20, width: 30, html: duration.toString("h:mm") }
      ];
    },
    onBeforeResHeaderRender: args => {
      let dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      // console.log("args.resource.html", args.resource);
      args.resource.html = dow[args.resource.index];

      // To Show Day & Date use
      // args.resource.html = dow[args.resource.index] + ' ' + args.resource.html;

      if (args.resource.loaded === false) {
        args.resource.html += " (loaded dynamically)";
        args.resource.backColor = "gray";
      }
    },
    eventMoveHandling: "Update",
    onEventMoved: args => {
      console.log('move', args);
      // this.message("Event moved");
    },
    eventResizeHandling: "Update",
    onEventResized: args => {
      console.log('resize', args);
      // this.message("Event resized");
    },
    eventDeleteHandling: "Update",
    onEventDeleted: args => {
      // this.message("Event deleted");
      console.log('delete', args);
    }
  };


  constructor(
    private calendarSvc: CalendarService,
    private breadCrumbSvc: BreadcrumbService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Admin Calendars', routerLink: ['/admin/calendar'] },
      { label: 'Templates', routerLink: ['/admin/calendar/templates'] }
    ]);

    let now = moment();
    console.log('hello date', now.format());
    console.log(now.add(7, 'days').format());
  }

  ngAfterViewInit(): void {
    var from = this.scheduler.control.visibleStart();
    var to = this.scheduler.control.visibleEnd();
    this.calendarSvc.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
    this.calendarSvc.get().subscribe(result => {
      console.log('templates', result);
      this.templates = result;

      this.setFirstListItem();

    });
  }

  createNewTemplate() {
    this.itemsList.deselectAll();
    this.selectedTemplate = new CalTemplate();
    this.copySelectedItem();
  }

  saveItem() {
    if (this.selectedTemplate.id) {
      // Update existing item

      this.calendarSvc.put(this.selectedTemplate.id, this.selectedTemplate)
        .subscribe(result => {
          this.updateList(result);
          this.hideModals();
          this.toastSvc.showSuccessMessage('Item Updated');
        },
          (error) => {
            console.log(error);
            this.toastSvc.showErrorMessage('There was an error saving the item.');
          },
          () => {
            // final
          })
    } else {
      // Add new item
      this.calendarSvc.post(this.selectedTemplate)
        .subscribe(result => {
          console.log('result', result);
          this.updateList(result);
          this.hideModals();
          this.toastSvc.showSuccessMessage('Item Saved');
        },
          (error) => {
            console.log(error);
            this.toastSvc.showErrorMessage('There was an error saving the item.');
          },
          () => {
            // final
          })

    }
  }

  cancelDataItemEdit(event) {
    this.selectedTemplate = Object.assign(new CalTemplate(), this.selectedTemplateBak);
    this.templates[this.selectedTemplateIdx] = this.selectedTemplate;
  }

  deleteDataItemRequest() {
    // if(!this.allowDeleteItems) {
    //   this.toastSvc.showInfoMessage('Delete support is currently not available.');
    //   return;
    // }
    this.showDeleteItemModal = true;
  }

  deleteDataItem() {
    this.calendarSvc.delete(this.selectedTemplate.id)
      .subscribe(result => {
        this.toastSvc.showSuccessMessage('The item has been deleted.');
        this.templates.splice(this.getIndexOfItem(), 1);
        this.selectedTemplate = this.templates[0];
      },
        (error) => {
          console.log(error);
          this.toastSvc.showErrorMessage('There was an error deleting the item.');
        },
        () => {
          // final
        })
  }

  hideModals() {
    this.showDeleteItemModal = false;
  }

  private setFirstListItem() {
    if (!this.templates || !this.templates.length)
      return;

    this.selectedTemplate = this.templates[0];
    this.copySelectedItem();
    setTimeout(() => {
      if (this.itemsList.options.first)
        this.itemsList.options.first.selected = true;
    }, 100);
  }

  private updateList(result) {
    let index: number = this.getIndexOfItem(result);

    if (index >= 0) {
      this.templates[index] = result;
    } else {
      this.templates.push(result);
    }
  }

  private copySelectedItem() {
    this.selectedTemplateBak = Object.assign({}, this.selectedTemplate);
    this.selectedTemplateIdx = this.getIndexOfItem(this.selectedTemplate);
  }

  private getIndexOfItem(item = this.selectedTemplate): number {
    return this.templates
      .findIndex(itm => itm.id == item.id);
  }

}
