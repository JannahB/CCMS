import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import * as moment from 'moment';
import { DayPilot, DayPilotSchedulerComponent } from "daypilot-pro-angular";

import { BreadcrumbService } from './../../../breadcrumb.service';
import { ToastService } from './../../../common/services/utility/toast.service';
import { CalTemplate } from '../../../common/entities/CalTemplate';
import { CalFacility } from '../../../common/entities/CalFacility';
import { CalFacilityTag } from './../../../common/entities/CalFacilityTag';
import { CalFacilityService } from './../../../common/services/http/calFacility.service';

@Component({
  selector: 'app-cal-facilities',
  templateUrl: './cal-facilities.component.html',
  styleUrls: ['./cal-facilities.component.scss']
})
export class CalFacilitiesComponent implements OnInit {

  @ViewChild("scheduler")
  scheduler: DayPilotSchedulerComponent;

  @ViewChild(MatSelectionList)
  matSelectionList: MatSelectionList;

  facilities: any[] = [];
  selectedFacility: any;
  selectedFacilityBak: any;
  selectedFacilityIdx: number;
  showDeleteItemModal: boolean = false;
  selectedWorkWeek: any;
  searchText: String;

  facilityTags: any[];
  selectedTags: CalFacilityTag[];
  filteredTags: CalFacilityTag[];


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
    eventDoubleClickHandling: true,

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
      this.saveItem();
    },
    eventResizeHandling: "Update",
    onEventResized: args => {
      console.log('resize', args);
      // this.message("Event resized");
      this.saveItem();
    },
    eventDeleteHandling: "Update",
    onEventDeleted: args => {
      // delete TemplateTime data.id
      this.selectedFacility.days = this.selectedFacility.days.slice();
      this.deleteTimeBlock(args.e.data.id, true);
      // console.log('delete', args);
    }
  };

  deleteTimeBlock(id, userInitiated = false) {
    this.calFacilitySvc.deleteFacilityTimeBlock(id)
      .subscribe(result => {
        console.log('Deleted Block ID:', id);
        //if(userInitiated) // TODO: Turn this on after testing complete
        this.toastSvc.showInfoMessage('Time block deleted.');
      });
  }

  constructor(
    private calFacilitySvc: CalFacilityService,
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
      { label: 'Facility Hours', routerLink: ['/admin/calendar/facilities'] }
    ]);

    let now = moment();
    console.log('hello date', now.format());
    console.log(now.add(7, 'days').format());
    console.log('now after add 7', now.format())
  }

  genLongId() {
    return Math.round((Math.random() * 10000000000000000))
  }

  ngOnInit() {

    // this.selectedWorkWeek = this.getMonday('2018-11-10T08:30:00');
    this.selectedWorkWeek = this.getMonday();

    this.facilities = [];
    this.facilityTags = [
      { id: 1, name: 'Jury Room' },
      { id: 2, name: 'Near Detention Center' },
      { id: 3, name: 'Video Conferencing' },
    ];
    this.filteredTags = this.facilityTags;

    // Handle mat-selection-list selection change via dom element so we can DeselectAll
    this.matSelectionList.selectionChange.subscribe((event: MatSelectionListChange) => {
      this.matSelectionList.deselectAll();
      event.option.selected = true;
      this.selectedFacility = event.option.value;
      this.copySelectedItem();
    });

    this.selectedFacility = new CalFacility();
  }

  ngOnDestroy() {
    // if (this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    var from = this.scheduler.control.visibleStart();
    var to = this.scheduler.control.visibleEnd();

    this.onSelectWorkWeek(this.selectedWorkWeek);

    this.calFacilitySvc.get().subscribe(result => {
      console.log('facilities', result);
      this.facilities = result;

      this.setFirstListItem();
    });
  }

  getMonday(date = new Date().toDateString()) {
    console.log('date', date)
    // '2018-11-10T08:30:00'
    let d = new Date(date);
    let diff = (d.getDate() - d.getDay()) + 1;

    return new Date(d.setDate(diff));
    // return new Date( d.getDate() - d.getDay() + 1).toUTCString();
  }

  onInput(e) {

  }

  onSelectWorkWeek(e) {
    console.log('onSelectWorkWeek(e)', e)
    this.selectedWorkWeek = this.getMonday(new Date(e).toDateString());
    this.scheduler.control.startDate = this.selectedWorkWeek;
    this.scheduler.control.update();
  }

  createNewFacility() {
    this.matSelectionList.deselectAll();
    this.selectedFacility = new CalFacility();
    this.copySelectedItem();
  }

  saveItem() {
    console.log('BEFORE Save Facility:', this.selectedFacility);

    this.calFacilitySvc.save(this.selectedFacility)
      .subscribe(result => {
        console.log('AFTER Save Facility:', this.selectedFacility);
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

  cancelDataItemEdit(event) {
    this.selectedFacility = Object.assign(new CalTemplate(), this.selectedFacilityBak);
    this.facilities[this.selectedFacilityIdx] = this.selectedFacility;
  }

  deleteDataItemRequest() {
    this.showDeleteItemModal = true;
  }

  deleteDataItem() {
    this.calFacilitySvc.delete(this.selectedFacility.id)
      .subscribe(result => {
        this.toastSvc.showSuccessMessage('The item has been deleted.');
        this.facilities.splice(this.getIndexOfItem(), 1);
        this.selectedFacility = this.facilities[0];
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

  refreshCalendar() {
    this.scheduler.control.update();
  }

  hideModals() {
    this.showDeleteItemModal = false;
  }

  onChooseTemplate() {
    // TODO: Handle this
  }

  saveAsTemplate() {
    // TODO: Handle this
  }

  applyToNextWeek() {

    let days = this.selectedFacility.days;

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
    }, 500);

  }


  private isWithinSpanByDay(day, start, end) {
    let s = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0);
    let e = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59);
    let d = new Date(day);
    return d >= s && d <= e;
  }

  findDatesWithinASpan(arr, start, span) {
    let rangeStart = new Date(start);
    let rangeEnd = rangeStart.addDays(span);
    let results = [];
    arr.forEach(block => {
      if (this.isWithinSpanByDay(block.start, rangeStart, rangeEnd)) {
        // console.log('** is in range', block.start);
        results.push(Object.assign({}, block));
      }
    })
    return results;
  }

  removeDatesWithinASpan(arr, start, span) {
    let rangeStart = new Date(start);
    let rangeEnd = rangeStart.addDays(span);

    let deletedItems = [];

    for (var i = arr.length - 1; i >= 0; i--) {
      if (this.isWithinSpanByDay(arr[i].start, rangeStart, rangeEnd)) {
        // console.log('* deleting: ', arr[i].start);
        deletedItems.push(Object.assign({}, arr[i]));
        this.deleteTimeBlock(arr[i].id);
        arr.splice(i, 1);
        // console.log('arr.length', arr.length);
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
      this.selectedFacility.days.push(block);
      // for comparison only
      newItemsForComparison.push(block);
    })
    console.log('3. Next Weeks Time Blocks For Comparison', newItemsForComparison)
  }



  // -------- TAGS MULTI-SELECT METHODS ---------- //

  getTagsToFilter(event) {
    let query = event.query;
    this.filteredTags = this.filterTags(query, this.facilityTags);
  }

  filterTags(query, facilityTags: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < facilityTags.length; i++) {
      let tag = facilityTags[i];
      if (tag.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tag);
      }
    }
    return filtered;
  }


  private setFirstListItem() {
    if (!this.facilities || !this.facilities.length)
      return;

    this.selectedFacility = this.facilities[0];
    this.copySelectedItem();
    setTimeout(() => {
      if (this.matSelectionList.options.first)
        this.matSelectionList.options.first.selected = true;
    }, 100);
  }

  private updateList(result) {
    let index: number = this.getIndexOfItem(result);

    if (index >= 0) {
      this.facilities[index] = result;
      this.selectedFacility = this.facilities[index];
    } else {
      this.facilities.push(result);
      this.selectedFacility = this.facilities[this.facilities.length - 1];
    }
    // This prevents event doubling phenom
    this.selectedFacility.days = this.selectedFacility.days.slice();
  }

  private copySelectedItem() {
    this.selectedFacilityBak = Object.assign({}, this.selectedFacility);
    this.selectedFacilityIdx = this.getIndexOfItem(this.selectedFacility);
  }

  private getIndexOfItem(item = this.selectedFacility): number {
    return this.facilities
      .findIndex(itm => itm.id == item.id);
  }

}

