import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DayPilot, DayPilotSchedulerComponent } from "daypilot-pro-angular";

import { BreadcrumbService } from '../../../breadcrumb.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { CalFacility } from '../../../common/entities/CalFacility';
import { CalFacilityTag } from '../../../common/entities/CalFacilityTag';
import { CalFacilityTime } from '../../../common/entities/CalFacilityTime';
import { CalTemplateService } from '../../../common/services/http/calTemplate.service';
import { CalCourtLocationService } from "../../../common/services/http/calCourtLocation.service";
import { CourtLocation } from './../../../common/entities/CourtLocation';
import { CalendarUtils } from './../../../common/utils/calendar-utils';

@Component({
  selector: 'app-cal-facilities',
  templateUrl: './cal-facilities.component.html',
  styleUrls: ['./cal-facilities.component.scss']
})
export class CalFacilitiesComponent implements OnInit {

  @ViewChild("scheduler")
  scheduler: DayPilotSchedulerComponent;

  facilities: any[] = [];
  selectedFacility: any;
  selectedFacilityBak: any;
  selectedFacilityIdx: number;
  showDeleteItemModal: boolean = false;
  selectedWorkWeek: any;
  searchText: String;
  templates: any[];
  selectedTemplate: any;
  showChooseTemplateModal: boolean = false;

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
    days: 6,
    businessWeekends: true,
    startDate: this.selectedWorkWeek || CalendarUtils.getMonday(),
    heightSpec: "Max",
    height: 300,
    allowEventOverlap: false,

    timeRangeSelectedHandling: "Enabled", // "Enabled (default), Disabled "
    onTimeRangeSelected: args => {
      let dp = args.control;
      dp.events.add(new DayPilot.Event({
        start: args.start,
        end: args.end,
        id: CalendarUtils.genLongId(),
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

      // NOTE: no need for explicit remove since binding removes the time block
      // this.deleteTimeBlock(args.e.data.id, true);
      this.selectedFacility.days = this.selectedFacility.days.slice();
      this.saveItem();
    }
  };

  constructor(
    private calCourtLocationSvc: CalCourtLocationService,
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
      { label: 'Facility Hours', routerLink: ['/admin/calendar/facilities'] }
    ]);
  }

  ngOnInit() {

    // this.selectedWorkWeek = this.getMonday('2018-11-10T08:30:00');
    this.selectedWorkWeek = CalendarUtils.getMonday();

    this.facilities = [];
    this.facilityTags = [
      { id: 1, name: 'Jury Room' },
      { id: 2, name: 'Near Detention Center' },
      { id: 3, name: 'Video Conferencing' },
    ];
    this.filteredTags = this.facilityTags;
    this.selectedFacility = new CalFacility();
  }

  locationOnRowSelect(event) {
    this.scheduler.control.clearSelection();
    this.setSelectedLocation(event.data);
  }

  setSelectedLocation(facility) {
    this.selectedFacility = facility;
    this.copySelectedItem();
  }

  ngOnDestroy() {
    // if (this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.onSelectWorkWeek(this.selectedWorkWeek);
    this.calCourtLocationSvc.get().subscribe(result => {
      console.log('court locations', result);
      this.facilities = result;
      this.setFirstListItem();
    });

    this.calTemplateSvc.get().subscribe(result => {
      this.templates = result;
    });
  }

  onSelectWorkWeek(e) {
    this.selectedWorkWeek = CalendarUtils.getMonday(new Date(e).toDateString());
    this.scheduler.control.startDate = this.selectedWorkWeek;
    this.scheduler.control.update();
  }

  createNewFacility() {
    this.selectedFacility = new CalFacility();
    this.copySelectedItem();
  }

  saveItem() {
    this.scheduler.control.clearSelection();
    this.calCourtLocationSvc.save(this.selectedFacility)
      .subscribe(result => {
        // console.log('AFTER Save Facility:', this.selectedFacility);
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
    this.selectedFacility = Object.assign(new CalFacility(), this.selectedFacilityBak);
    this.facilities[this.selectedFacilityIdx] = this.selectedFacility;
  }

  deleteDataItemRequest() {
    this.showDeleteItemModal = true;
  }

  deleteDataItem() {
    this.calCourtLocationSvc.delete(this.selectedFacility.id)
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

  deleteTimeBlock(id, userInitiated = false) {
    let idx = this.selectedFacility.days.findIndex(item => item.id == id);
    if (idx > -1) {
      this.selectedFacility.days.splice(idx, 1);
      // NOTE: JB removed save b/c all others that call this, call saveItem()
      // this.saveItem();
    }
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

    let templateDays = this.selectedTemplate.days;
    console.log('BEFORE selectedFacility.days', this.selectedFacility.days);
    console.log('TEMPLATE DAYS', this.selectedTemplate.days);

    // DELETE TIME BLOCKS IN THE CURRENT WEEK
    this.selectedFacility.days = CalendarUtils.removeDatesWithinASpan(this.selectedFacility.days, this.selectedWorkWeek, 6);
    console.log('1. Time blocks sans THIS weeks time blocks', this.selectedFacility.days);

    // LOOP SELECTED TEMPLATE BLOCKS ASSIGN TO THIS WEEK
    templateDays.forEach(block => {
      let bs = new DayPilot.Date(block.start);
      let be = new DayPilot.Date(block.end);
      let bDay = bs.getDay();

      // find the Date of the Day in the current week
      let matchingDate = CalendarUtils.getDateObjByDay(bDay, this.selectedWorkWeek);

      // Create new Time Block
      let newBlock = new CalFacilityTime();
      newBlock.id = CalendarUtils.genLongId();
      newBlock.facilityId = this.selectedFacility.id;
      newBlock.text = 'Available';

      console.log('TEMPLATE BLOCK date', bs);
      console.log('MATCHING DATE .getTimezoneOffset', matchingDate.getTimezoneOffset());

      newBlock.start = new DayPilot.Date(CalendarUtils.makeDPDateConstructorString(
        matchingDate.getFullYear(),
        matchingDate.getMonth(),
        matchingDate.getDate(),
        bs.getHours(),
        bs.getMinutes()
      ));
      newBlock.end = new DayPilot.Date(CalendarUtils.makeDPDateConstructorString(
        matchingDate.getFullYear(),
        matchingDate.getMonth(),
        matchingDate.getDate(),
        be.getHours(),
        be.getMinutes()
      ));

      // Add the newBlock to Facility.days
      this.selectedFacility.days.push(newBlock);

    });

    this.selectedFacility.days = this.selectedFacility.days.slice();
    this.scheduler.control.update();
    console.log('AFTER selectedFacility.days', this.selectedFacility.days);
    // SAVE NEW BLOCKS
    this.saveItem();
  }


  // -------- APPLY TO NEXT WEEK SECTION ------------ //

  applyToNextWeek() {

    let days = this.selectedFacility.days;

    // REMOVE TIME BLOCKS IN UPCOMING WEEK
    this.selectedFacility.days = CalendarUtils.removeDatesWithinASpan(days, this.selectedWorkWeek.addDays(7), 6);
    console.log('1. days Sans Next Weeks time blocks', this.selectedFacility.days);

    // FIND TIME BLOCKS IN THIS WEEK DATES TO APPLY TO NEXT WEEK
    let newTimeBlocks = CalendarUtils.findDatesWithinASpan(days, this.selectedWorkWeek, 6);
    console.log('2. matching Time Blocks', newTimeBlocks);

    // CONVERT THIS WEEK'S TIME BLOCKS TO NEXT WEEK TIME BLOCKS
    let nextWeeksDays = CalendarUtils.convertTimeBlocksToNextWeek(newTimeBlocks);
    this.selectedFacility.days = [...days, ...nextWeeksDays]
    this.onSelectWorkWeek(this.selectedWorkWeek.addDays(7).toISOString());
    this.scheduler.control.update();

    setTimeout(() => {
      this.saveItem()
      this.toastSvc.showInfoMessage('Week Saved!', 'The calendar has advanced to the following week.')
    }, 300);
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
