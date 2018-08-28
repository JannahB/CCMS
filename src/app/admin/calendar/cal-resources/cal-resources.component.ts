import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import * as moment from 'moment';
import { DayPilot, DayPilotSchedulerComponent } from "daypilot-pro-angular";

import { BreadcrumbService } from '../../../breadcrumb.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { CalTemplate } from '../../../common/entities/CalTemplate';
import { CalResourceService } from "../../../common/services/http/calResource.service";
import { CalResource } from '../../../common/entities/CalResource';
import { CalResourceTime } from '../../../common/entities/CalResourceTime';
import { CalTemplateService } from '../../../common/services/http/calTemplate.service';

@Component({
  selector: 'app-cal-resources',
  templateUrl: './cal-resources.component.html',
  styleUrls: ['./cal-resources.component.scss']
})
export class CalResourcesComponent implements OnInit {

  @ViewChild("scheduler")
  scheduler: DayPilotSchedulerComponent;

  @ViewChild(MatSelectionList)
  matSelectionList: MatSelectionList;


  resources: any[] = [];
  selectedResource: any;
  selectedResourceBak: any;
  selectedResourceIdx: number;
  showDeleteItemModal: boolean = false;
  selectedWorkWeek: any;
  searchText: String;
  templates: any[];
  selectedTemplate: any;
  showChooseTemplateModal: boolean = false;

  config: any = {
    theme: "minimal_blue",
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
    startDate: this.selectedWorkWeek || this.getMonday(),
    heightSpec: "Max",
    height: 300,

    allowEventOverlap: false,

    timeRangeSelectedHandling: "Enabled", // "Enabled (default), Disabled "
    onTimeRangeSelected: args => {
      let dp = args.control;
      dp.events.add(new DayPilot.Event({
        start: args.start,
        end: args.end,
        id: this.genLongId(),
        resource: args.resource,
        text: 'Available'
      }));
      this.saveItem();

      // -------- MODAL EVENT NAMING - Use this block to present a naming modal to user ------
      // DayPilot.Modal.prompt("Create a new task:", "Available").then(function (modal) {
      //   var dp = args.control;
      //   dp.clearSelection();
      //   if (!modal.result) { return; }
      //   // id: Math.random() * 1000000/1000000,
      //   dp.events.add(new DayPilot.Event({
      //     start: args.start,
      //     end: args.end,
      //     id: DayPilot.guid(),
      //     resource: args.resource,
      //     text: modal.result
      //   }));
      // });
    },

    eventDoubleClickHandling: true,
    onEventDoubleClick: args => {
      DayPilot.Modal.prompt("Edit Time Block:", args.e.data.text).then(function (modal) {
        if (!modal.result) { return; }
        args.e.data.text = modal.result;
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
      // This adds the event duration ex: 4:00 on the event
      // var duration = new DayPilot.Duration(args.data.start, args.data.end);
      // args.data.areas = [
      //   { right: 2, top: 6, height: 20, width: 30, html: duration.toString("h:mm") }
      // ];
    },
    onBeforeResHeaderRender: args => {
      let dow = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      // console.log("args.resource.html", args.resource);

      // To Show day of week only use
      // args.resource.html = dow[args.resource.index];

      // To Show Day & Date use
      args.resource.html = dow[args.resource.index] + ' ' + args.resource.html;

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
      // delete TemplateTime data.id
      this.selectedResource.days = this.selectedResource.days.slice();
      this.deleteTimeBlock(args.e.data.id, true);
      // console.log('delete', args);
    }
  };


  constructor(
    private calResourceSvc: CalResourceService,
    private calTemplateSvc: CalTemplateService,
    private breadCrumbSvc: BreadcrumbService,
    private toastSvc: ToastService
  ) {

    // TODO: move this to a date util lib
    Date.prototype.addDays = function (numberOfDays) {
      // send negative number to subtract days
      var dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + numberOfDays);
      return dat;
    }

    this.breadCrumbSvc.setItems([
      { label: 'Admin Calendars', routerLink: ['/admin/calendar'] },
      { label: 'Resource Hours', routerLink: ['/admin/calendar/resources'] }
    ]);

    let now = moment();
    console.log('hello date', now.format());
    console.log(now.add(7, 'days').format());
  }

  // TODO: Move to util lib
  private genLongId() {
    return Math.round((Math.random() * 10000000000000000))
  }

  ngOnInit() {

    this.selectedWorkWeek = this.getMonday();

    this.resources = [];

    this.resources =
      [
        {
          "id": 1,
          "name": "Justice Gonzales",
          "description": "",
          "court": 5,
          "days": [{
            "id": 9,
            "start": "2018-01-01T04:00:00-05:00",
            "end": "2018-01-01T07:00:00-05:00"
          }]
        },
        {
          "id": 2,
          "name": "Master Cielto-Jones",
          "description": "",
          "court": 5,
          "days": [{
            "id": 9,
            "start": "2018-01-02T04:00:00-05:00",
            "end": "2018-01-02T07:00:00-05:00"
          }]
        }
      ]

    // Handle mat-selection-list selection change via dom element so we can DeselectAll
    this.matSelectionList.selectionChange.subscribe((event: MatSelectionListChange) => {
      this.matSelectionList.deselectAll();
      event.option.selected = true;
      this.selectedResource = event.option.value;
      this.copySelectedItem();
    });

    this.selectedResource = new CalResource();
  }

  ngOnDestroy() {
    // if (this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    var from = this.scheduler.control.visibleStart();
    var to = this.scheduler.control.visibleEnd();

    this.onSelectWorkWeek(this.selectedWorkWeek);

    this.calResourceSvc.get().subscribe(result => {
      console.log('resources', result);
      this.resources = result;

      this.setFirstListItem();
    });

    this.calTemplateSvc.get().subscribe(result => {
      this.templates = result;
    });
  }

  // TODO: move to util lib
  getMonday(date = new Date().toDateString()) {
    console.log('date', date)
    // '2018-11-10T08:30:00'
    let d = new Date(date);
    let diff = (d.getDate() - d.getDay()) + 1;

    return new Date(d.setDate(diff));
  }


  onSelectWorkWeek(e) {
    console.log('onSelectWorkWeek(e)', e)
    this.selectedWorkWeek = this.getMonday(new Date(e).toDateString());
    this.scheduler.control.startDate = this.selectedWorkWeek;
    this.scheduler.control.update();
  }

  createNewResource() {
    this.matSelectionList.deselectAll();
    this.selectedResource = new CalResource();
    this.copySelectedItem();
  }

  saveItem() {
    // console.log('BEFORE Save RESOURCE:', this.selectedResource);

    this.calResourceSvc.save(this.selectedResource)
      .subscribe(result => {
        // console.log('AFTER Save RESOURCE:', this.selectedResource);
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
        });
  }

  cancelDataItemEdit(event) {
    this.selectedResource = Object.assign(new CalResource(), this.selectedResourceBak);
    this.resources[this.selectedResourceIdx] = this.selectedResource;
  }

  deleteDataItemRequest() {
    this.showDeleteItemModal = true;
  }

  deleteDataItem() {
    this.calResourceSvc.delete(this.selectedResource.id)
      .subscribe(result => {
        this.toastSvc.showSuccessMessage('The item has been deleted.');
        this.resources.splice(this.getIndexOfItem(), 1);
        this.selectedResource = this.resources[0];
        this.hideModals();
      },
        (error) => {
          console.log(error);
          this.toastSvc.showErrorMessage('There was an error deleting the item.');
        },
        () => {
          // final
        })
  }

  deleteTimeBlock(id, userInitiated = false) {
    this.calResourceSvc.deleteResourceTimeBlock(id)
      .subscribe(result => {
        console.log('Deleted Block ID:', id);
        if (userInitiated) // TODO: Turn this on after testing complete
          this.toastSvc.showInfoMessage('Time block deleted.');
      });
  }

  refreshCalendar() {
    this.scheduler.control.update();
  }

  hideModals() {
    this.showDeleteItemModal = false;
    this.showChooseTemplateModal = false;
  }

  // -------- APPLY TEMPLATE SECTION ------------ //
  onShowChooseTemplateModal() {
    this.showChooseTemplateModal = true;
  }

  // mat-selection-list "selectionChange" does not work when in a modal,
  // so solving it by handling mat-list-option (selectionChange) here
  onTemplateSelectionChange(event, template) {

    // deselect all others & set selected
    if (event.selected) {
      event.source.selectionList.options.toArray().forEach(element => {
        if (element.value.name != template.name) {
          element.selected = false;
        } else {
          this.selectedTemplate = element.value;
        }
      });
    }
  }

  onTemplateSelected() {
    console.log('onTemplateSelected', this.selectedTemplate);
    this.hideModals();
    this.mapTemplateToThisWeek();
  }

  mapTemplateToThisWeek() {
    if (!this.selectedTemplate) {
      this.toastSvc.showWarnMessage('No Template Selected', 'Please choose a template.');
      return;
    }

    console.log('BEFORE selectedResource.days', this.selectedResource.days);

    let templateDays = this.selectedTemplate.days;
    console.log('TEMPLATE DAYS', this.selectedTemplate.days);

    // DELETE TIME BLOCKS IN THE CURRENT WEEK
    let daysSansThisWeekDays = this.removeDatesWithinASpan(this.selectedResource.days, this.selectedWorkWeek, 6);
    console.log('1. Time blocks sans THIS weeks time blocks', daysSansThisWeekDays);

    // LOOP SELECTED TEMPLATE BLOCKS ASSIGN TO THIS WEEK
    templateDays.forEach(block => {
      let bs = new Date(block.start); // -05:00
      let be = new Date(block.end);
      let bDay = bs.getDay();

      // find the Date of the Day in the current week
      let matchingDate = this.getDateObjByDay(bDay, this.selectedWorkWeek);  // -04:00

      // Create new Time Block
      let newBlock = new CalResourceTime();
      newBlock.id = this.genLongId();
      newBlock.resourceId = this.selectedResource.id;
      newBlock.text = 'Available';

      console.log('TEMPLATE BLOCK .getTimezoneOffset', bs.getTimezoneOffset());
      console.log('MATCHING DATE .getTimezoneOffset', matchingDate.getTimezoneOffset());

      // merge TIME portion of 'block' into DATE portion of 'matchingDate'
      newBlock.start = new Date(
        matchingDate.getFullYear(),
        matchingDate.getMonth(),
        matchingDate.getDate(),
        bs.getHours() + 1,  // BEWARE!! this +1 is an ugly hack that WILL come back to bite (see note below)
        bs.getMinutes(), 0
      );
      newBlock.end = new Date(
        matchingDate.getFullYear(),
        matchingDate.getMonth(),
        matchingDate.getDate(),
        be.getHours() + 1, // BEWARE!! this +1 is an ugly hack that WILL come back to bite (see note below)
        be.getMinutes(), 0
      );
      /*
      NOTE ABOUT +1 getHours() ABOVE - JB:6/21/2018
          When creating a new date in this client, the offset is -04:00.
          When saving and retrieving, the offset becomes -05:00.
          So as a temp measure, the +1 is used until we solve this issue.
          The solution will need to consider:
          -- Server hosted in other time zones
          -- Server in a time zone that doesn't observe DST
          -- User in other time zones
          -- User in a time zone that doesn't observe DST
      */

      // Add the newBlock to Facility.days
      this.selectedResource.days.push(newBlock);

    });

    this.selectedResource.days = this.selectedResource.days.slice();
    this.scheduler.control.update();
    console.log('AFTER selectedResource.days', this.selectedResource.days);
    // SAVE NEW BLOCKS
    this.saveItem();

  }

  // TODO: move to Date Util Lib
  private getDateObjByDay(day: number, start: any): Date {
    let s = new Date(start);
    let found = false;
    while (!found) {
      if (s.getDay() == day) {
        found = true;
        return s;
      } else {
        s = new Date(s.setDate(s.getDate() + 1))
      }
    }
  }

  // TODO: move to Date Util Lib
  private getARangeOfDatesAndDays(start, span) {
    let s = new Date(start);
    let e = s.addDays(span);
    let a = [];

    while (s <= e) {
      let o = {};

      o['day'] = s.getDay();
      o['date'] = s.getDate();
      a.push(o);
      s = new Date(s.setDate(s.getDate() + 1))
    }
    return a;
  };


  // -------- APPLY TO NEXT WEEK SECTION ------------ //

  applyToNextWeek() {

    let days = this.selectedResource.days;

    // REMOVE TIME BLOCKS IN UPCOMING WEEK
    let daysSansNextWeekDays = this.removeDatesWithinASpan(days, this.selectedWorkWeek.addDays(7), 6);
    console.log('1. days Sans Next Weeks time blocks', daysSansNextWeekDays);

    // FIND TIME BLOCKS IN THIS WEEK DATES TO APPLY TO NEXT WEEK
    let newTimeBlocks = this.findDatesWithinASpan(days, this.selectedWorkWeek, 6);
    console.log('2. matching Time Blocks', newTimeBlocks);

    // CONVERT THIS WEEK'S TIME BLOCKS TO NEXT WEEK TIME BLOCKS
    this.convertTimeBlocksToNextWeek(newTimeBlocks);
    this.onSelectWorkWeek(this.selectedWorkWeek.addDays(7).toISOString());
    this.scheduler.control.update();

    setTimeout(() => {
      this.saveItem()
      this.toastSvc.showInfoMessage('Week Saved!', 'The calendar has advanced to the following week.')
    }, 300);
  }

  // TODO: move to util lib
  private isWithinRangeByDay(day, start, end) {
    let s = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0);
    let e = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59);
    let d = new Date(day);
    return d >= s && d <= e;
  }

  // TODO: move to util lib
  findDatesWithinASpan(arr, start, span) {
    let rangeStart = new Date(start);
    let rangeEnd = rangeStart.addDays(span);
    let results = [];
    arr.forEach(block => {
      if (this.isWithinRangeByDay(block.start, rangeStart, rangeEnd)) {
        results.push(Object.assign({}, block));
      }
    })
    return results;
  }

  // TODO: move to util lib
  /**
   * @argument arr Array of time blocks
   * @argument start:String a start date string
   * @argument span number of days to span
   * @description removes matching items from the array and calls delete EP
   */
  removeDatesWithinASpan(arr, start, span) {
    let rangeStart = new Date(start);
    let rangeEnd = rangeStart.addDays(span);

    let deletedItems = []; // for debug only

    for (var i = arr.length - 1; i >= 0; i--) {
      if (this.isWithinRangeByDay(arr[i].start, rangeStart, rangeEnd)) {
        deletedItems.push(Object.assign({}, arr[i]));
        this.deleteTimeBlock(arr[i].id);
        arr.splice(i, 1);
      }
    }
    console.log('Deleted items', deletedItems);
    return arr;
  }

  convertTimeBlocksToNextWeek(arr) {
    let newItemsForComparison = [];
    arr.forEach(block => {
      block.start = new Date(block.start).addDays(7).toISOString();
      block.end = new Date(block.end).addDays(7).toISOString();
      block.id = this.genLongId();
      this.selectedResource.days.push(block);
      newItemsForComparison.push(block); // for debug only
    })
    console.log('3. Next Weeks Time Blocks For Comparison', newItemsForComparison)
  }




  private setFirstListItem() {
    if (!this.resources || !this.resources.length)
      return;

    this.selectedResource = this.resources[0];
    this.copySelectedItem();
    setTimeout(() => {
      if (this.matSelectionList.options.first)
        this.matSelectionList.options.first.selected = true;
    }, 100);
  }

  private updateList(result) {
    let index: number = this.getIndexOfItem(result);

    if (index >= 0) {
      this.resources[index] = result;
      this.selectedResource = this.resources[index];
    } else {
      this.resources.push(result);
      this.selectedResource = this.resources[this.resources.length - 1];
    }
    // This prevents event doubling phenom
    this.selectedResource.days = this.selectedResource.days.slice();
  }

  private copySelectedItem() {
    this.selectedResourceBak = Object.assign({}, this.selectedResource);
    this.selectedResourceIdx = this.getIndexOfItem(this.selectedResource);
  }

  private getIndexOfItem(item = this.selectedResource): number {
    return this.resources
      .findIndex(itm => itm.id == item.id);
  }

}

