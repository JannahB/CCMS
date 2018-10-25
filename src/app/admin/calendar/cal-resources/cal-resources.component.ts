import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DayPilot, DayPilotSchedulerComponent } from "daypilot-pro-angular";

import { BreadcrumbService } from '../../../breadcrumb.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { CalResourceService } from "../../../common/services/http/calResource.service";
import { CalResource } from '../../../common/entities/CalResource';
import { CalResourceTime } from '../../../common/entities/CalResourceTime';
import { CalTemplateService } from '../../../common/services/http/calTemplate.service';
import { CalendarUtils } from './../../../common/utils/calendar-utils';

@Component({
  selector: 'app-cal-resources',
  templateUrl: './cal-resources.component.html',
  styleUrls: ['./cal-resources.component.scss']
})
export class CalResourcesComponent implements OnInit {

  @ViewChild("scheduler")
  scheduler: DayPilotSchedulerComponent;

  loadingDataFlag: boolean = false;
  resources: CalResource[] = [];
  selectedResource: CalResource;
  selectedResourceBak: CalResource;
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
      this.saveItem();
      // this.message("Event moved");
    },
    eventResizeHandling: "Update",
    onEventResized: args => {
      console.log('resize', args);
      this.saveItem();
      // this.message("Event resized");
    },
    eventDeleteHandling: "Update",
    onEventDeleted: args => {
      // NOTE: no need for explicit remove since binding removes the time block
      // this.deleteTimeBlock(args.e.data.id, true);
      this.selectedResource.days = this.selectedResource.days.slice();
      this.saveItem();
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

  }

  ngOnInit() {

    this.loadingDataFlag = true;
    this.resources = [];
    this.selectedWorkWeek = CalendarUtils.getMonday();
    this.selectedResource = new CalResource();
  }

  resourceOnRowSelect(event) {
    this.scheduler.control.clearSelection();
    this.setSelectedLocation(event.data);
  }

  setSelectedLocation(resource) {
    this.selectedResource = resource;
    this.copySelectedItem();
  }

  ngOnDestroy() {
    // if (this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.onSelectWorkWeek(this.selectedWorkWeek);
    this.calResourceSvc.getJudicialOfficers().subscribe(result => {
      console.log('resources', result);
      this.resources = result;

      this.setFirstListItem();
    },
      (error) => {
        console.log(error);
        this.toastSvc.showErrorMessage('There was an error loading resources.');
      },
      () => {
        // final
        this.loadingDataFlag = false;
      });

    this.calTemplateSvc.get().subscribe(result => {
      this.templates = result;
    });
  }

  onSelectWorkWeek(e) {
    console.log('onSelectWorkWeek(e)', e)
    this.selectedWorkWeek = CalendarUtils.getMonday(new Date(e).toDateString());
    this.scheduler.control.startDate = this.selectedWorkWeek;
    this.scheduler.control.update();
  }

  createNewResource() {
    this.selectedResource = new CalResource();
    this.copySelectedItem();
  }

  saveItem() {
    // console.log('BEFORE Save RESOURCE:', this.selectedResource);
    this.loadingDataFlag = true;
    this.scheduler.control.clearSelection();
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
          this.loadingDataFlag = false;
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
    this.loadingDataFlag = true;
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
          this.loadingDataFlag = false;
        })
  }

  deleteTimeBlock(id, userInitiated = false) {
    let idx = this.selectedResource.days.findIndex(item => item.id == id);
    if (idx > -1) {
      this.selectedResource.days.splice(idx, 1);
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
    console.log('BEFORE selectedResource.days', this.selectedResource.days);
    console.log('TEMPLATE DAYS', this.selectedTemplate.days);

    // DELETE TIME BLOCKS IN THE CURRENT WEEK
    this.selectedResource.days = CalendarUtils.removeDatesWithinASpan(this.selectedResource.days, this.selectedWorkWeek, 6);
    console.log('1. Time blocks sans THIS weeks time blocks', this.selectedResource.days);

    // LOOP SELECTED TEMPLATE BLOCKS ASSIGN TO THIS WEEK
    templateDays.forEach(block => {
      let bs = new DayPilot.Date(block.start);
      let be = new DayPilot.Date(block.end);
      let bDay = bs.getDay();

      // find the Date of the Day in the current week
      let matchingDate = CalendarUtils.getDateObjByDay(bDay, this.selectedWorkWeek);  // -04:00

      // Create new Time Block
      let newBlock = new CalResourceTime();
      newBlock.id = CalendarUtils.genLongId();
      newBlock.resourceId = this.selectedResource.id;
      newBlock.text = 'Available';

      console.log('TEMPLATE BLOCK date', bs);
      console.log('MATCHING DATE .getTimezoneOffset', matchingDate.getTimezoneOffset());

      // merge TIME portion of 'block' into DATE portion of 'matchingDate'
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
        be.getHours(), // BEWARE!! this +1 is an ugly hack that WILL come back to bite (see note below)
        be.getMinutes()
      ));

      // Add the newBlock to Facility.days
      this.selectedResource.days.push(newBlock);

    });

    this.selectedResource.days = this.selectedResource.days.slice();
    this.scheduler.control.update();
    console.log('AFTER selectedResource.days', this.selectedResource.days);
    // SAVE NEW BLOCKS
    this.saveItem();

  }


  // -------- APPLY TO NEXT WEEK SECTION ------------ //

  applyToNextWeek() {

    let days = this.selectedResource.days;

    // REMOVE TIME BLOCKS IN UPCOMING WEEK
    this.selectedResource.days = CalendarUtils.removeDatesWithinASpan(days, this.selectedWorkWeek.addDays(7), 6);
    console.log('1. days Sans Next Weeks time blocks', this.selectedResource.days);

    // FIND TIME BLOCKS IN THIS WEEK DATES TO APPLY TO NEXT WEEK
    let newTimeBlocks = CalendarUtils.findDatesWithinASpan(days, this.selectedWorkWeek, 6);
    console.log('2. matching Time Blocks', newTimeBlocks);

    // CONVERT THIS WEEK'S TIME BLOCKS TO NEXT WEEK TIME BLOCKS
    let nextWeeksDays = CalendarUtils.convertTimeBlocksToNextWeek(newTimeBlocks);
    this.selectedResource.days = [...days, ...nextWeeksDays];
    this.onSelectWorkWeek(this.selectedWorkWeek.addDays(7).toISOString());
    this.scheduler.control.update();

    setTimeout(() => {
      this.saveItem()
      this.toastSvc.showInfoMessage('Week Saved!', 'The calendar has advanced to the following week.')
    }, 300);
  }

  private setFirstListItem() {
    if (!this.resources || !this.resources.length)
      return;

    this.selectedResource = this.resources[0];
    this.copySelectedItem();
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
