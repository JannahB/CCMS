import { Component, Input, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { DayPilot, DayPilotSchedulerComponent } from "daypilot-pro-angular";

import { Case } from '../../../common/entities/Case';
import { CaseHearing } from '../../../common/entities/CaseHearing';
import { CaseHearingUnavailableBlock } from './../../../common/entities/CaseHearingUnavailableBlock';
import { CourtLocation } from '../../../common/entities/CourtLocation';
import { HearingType } from '../../../common/entities/HearingType';
import { JudicialOfficer } from '../../../common/entities/JudicialOfficer';
import { Permission } from '../../../common/entities/Permission';

import { CollectionUtil } from '../../../common/utils/collection-util';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { HearingsService } from './../../../common/services/http/hearings.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { UserService } from '../../../common/services/utility/user.service';

// This is needed for pipe used in markup
import { DropdownPipe } from '../../../common/pipes/dropdown.pipe';


@Component({
  selector: 'hearings',
  templateUrl: './hearings.component.html',
  styleUrls: ['./hearings.component.scss']
})
export class HearingsComponent implements OnInit {

  @ViewChild("scheduler")
  scheduler: DayPilotSchedulerComponent;

  @Input() case: Case;

  public Permission: any = Permission;
  datePipe: DatePipe = new DatePipe("en");

  // -------------------------
  //   HEARING
  // ------------------------=

  hearings: CaseHearing[];
  selectedHearing: CaseHearing;
  selectedHearingBak: CaseHearing;
  loadingDataFlag: boolean = false;
  hearingLocations: CourtLocation[];
  hearingTypes: HearingType[];
  hearingSubscription: Subscription;
  hearingConflicts: CaseHearingUnavailableBlock[];
  loadingConflicts: boolean = false;
  showDeleteHearingModal: boolean = false;
  judges: JudicialOfficer[];

  showDeleteItemModal: boolean = false;
  selectedWorkWeek: any;

  // CALENDAR CONFIG OBJECT -----------
  // ----------------------------------
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
    eventHeight: 30,
    cellWidthSpec: "Auto",
    timeHeaders: [{ "groupBy": "Hour" }, { "groupBy": "Cell", "format": "mm" }],
    scale: "CellDuration",
    cellDuration: 30,
    // startDate: this.selectedWorkWeek,
    // days: new DayPilot.Date("2017-07-01").daysInMonth(),
    days: 6,
    businessWeekends: true,
    heightSpec: "Max",
    height: 300,
    allowEventOverlap: true,

    timeRangeSelectedHandling: "Enabled", // "Enabled (default), Disabled "
    onTimeRangeSelected: args => {
      let dp = args.control;
      dp.events.add(new DayPilot.Event({
        start: args.start,
        end: args.end,
        id: this.genLongId(),
        resource: args.resource,
        text: 'Hearing'
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

    // PREVENT UNAVAILABLE TIME BLOCKS FROM BEING SELECTED
    onEventSelect: args => {
      if (args.selected && args.e.text().indexOf("Unavailable") !== -1) {  // prevent selecting events that contain the text "Unavailable"
        args.preventDefault();
      }
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
      // TODO: Use this to style events as unavailable or current hearing block
      // ----------------------------------------
      // Below adds the event duration ex: 4:00 on the event
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
    onBeforeCellRender: args => {
      let saturday = 6;
      let sunday = 0;
      let dayOfWeek = args.cell.start.dayOfWeek();
      if (dayOfWeek === sunday || dayOfWeek === saturday) {
        args.cell.backColor = "#f7f7f7"; // apply highlighting
      }
      // TODO: if cell falls in blocked resource/facility range
      let s = args.cell.start.value;
      let e = args.cell.end.value;

      this.blockedHoursOfOperation.forEach(item => {
        if (s >= item.start && e <= item.end) {
          args.cell.backColor = "#CCCCCC";
        }

      });
      //console.log('cell args', args);

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
      // this.selectedResource.days = this.selectedResource.days.slice();
      this.deleteTimeBlock(args.e.data.id, true);
    }
  };


  constructor(
    private breadCrumbSvc: BreadcrumbService,
    private toastSvc: ToastService,
    private userSvc: UserService,
    private hearingSvc: HearingsService
  ) {

    // TODO: move this to a date util lib
    Date.prototype.addDays = function (numberOfDays) {
      // send negative number to subtract days
      var dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + numberOfDays);
      return dat;
    }

    // this.breadCrumbSvc.setItems([
    //   { label: 'Admin Calendars', routerLink: ['/admin/calendar'] },
    //   { label: 'Resource Hours', routerLink: ['/admin/calendar/resources'] }
    // ]);

  }

  ngOnInit() {
    this.getLookups();
    this.hearings = [];
    this.selectedHearing = new CaseHearing();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    if (this.hearingSubscription) this.hearingSubscription.unsubscribe();
  }

  getLookups() {
    this.loadingDataFlag = true;
    var source = Observable.forkJoin<any>(
      this.hearingSvc.getJudicialOfficer(),
      this.hearingSvc.getCourtLocations(),
      this.hearingSvc.getHearingTypes(),
    );
    this.hearingSubscription = source.subscribe(
      results => {
        this.judges = results[0] as JudicialOfficer[];
        this.hearingLocations = results[1] as CourtLocation[];
        this.hearingTypes = results[2] as HearingType[];

        this.enhanceJudges();
        this.getHearings();

        console.log('judges', this.judges);
        console.log('hearing locations', this.hearingLocations);
        console.log('hearing types', this.hearingTypes);
      },
      (error) => {
        console.log('getLookups error', error);
        this.loadingDataFlag = false;
        this.toastSvc.showErrorMessage('There was an error fetching hearing reference data.')
      },
      () => {
        this.loadingDataFlag = false;
      });
  }

  getHearings() {
    this.loadingDataFlag = true;
    this.hearingSvc.getByCaseId(this.case.caseOID).subscribe(data => {
      this.hearings = data;
      this.loadingDataFlag = false;
      if (this.hearings.length) {
        this.initHearingData();
        this.setSelectedHearing(this.hearings[0]);
        this.getUnavailableBlocks();
      } else {
        this.setWorkWeek(new Date());
      }
    },
      (error) => {
        console.log('getHearings error', error);
        this.loadingDataFlag = false;
        this.toastSvc.showErrorMessage('There was an error fetching hearings.')
      },
      () => {
        this.loadingDataFlag = false;
      });
  }

  private enhanceJudges() {
    this.judges.map(j => j.name = j.firstName + ' ' + j.lastName); // concat first and last name
  }

  initHearingData() {
    // Loop thru caseHearings and append properties
    this.hearings.map(h => h.judicialOfficer = this.judges.find(j => j.id == h.judicialOfficerId));
    this.hearings.map(h => h.hearingType = this.hearingTypes.find(ht => ht.id == h.hearingTypeId));
    this.hearings.map(h => h.hearingLocation = this.hearingLocations.find(loc => loc.id == h.courtLocationId));
    this.hearings.map(h => h.hearingStartDateTime = h.days && h.days.length ? new Date(h.days[0].start) : new Date());
    this.hearings.map(h => h.hearingEndDateTime = h.days && h.days.length ? new Date(h.days[0].end) : new Date());

    console.log('hearings', this.hearings);

    // Pre-select Dropdowns
    if (this.selectedHearing.judicialOfficerId) {
      this.selectedHearing.judicialOfficer = this.judges.find(j => j.id == this.selectedHearing.judicialOfficerId);
    }

    if (this.selectedHearing.courtLocationId) {
      this.selectedHearing.hearingLocation = this.hearingLocations.find(h => h.id == this.selectedHearing.courtLocationId);
    }

    if (this.selectedHearing.hearingTypeId) {
      this.selectedHearing.hearingType = this.hearingTypes.find(ht => ht.id == this.selectedHearing.hearingTypeId);
    }
  }


  getUnavailableBlocks() {

    if (!this.selectedHearing.hearingStartDateTime
      || !this.selectedHearing.judicialOfficerId
      || !this.selectedHearing.courtLocationId) {

      return;
    }

    this.loadingDataFlag = true;
    this.hearingConflicts = [];
    this.hearingSvc.unavailableFacilityAndResourceBlocks(
      this.selectedHearing.hearingStartDateTime,
      this.selectedHearing.courtLocationId,
      this.selectedHearing.judicialOfficerId)
      .subscribe(data => {
        this.hearingConflicts = data;
        console.log('hearing conflicts', this.hearingConflicts);
        this.createBlockedArrays();
        this.loadingDataFlag = false;
      },
        (error) => {
          console.log(error);
          this.loadingDataFlag = false;
          this.toastSvc.showErrorMessage('There was an error fetching hearing conflicts data.')
        },
        () => {
          this.loadingDataFlag = false;
        });

    // FetchHearing POST {hearingQueryDate: "2018-01-09", courtLoc: "1"}
    // let hearingDateString: string = this.datePipe.transform(this.selectedHearing.startDateTime, "yyyy-MM-dd");

  }

  blockedHoursOfOperation = [];
  blockedHearings = [];

  createBlockedArrays() {
    let blockedHoo = this.hearingConflicts.filter(item => item.type == 'Facility' || item.type == 'Resource');
    let days = []

    this.hearingConflicts.forEach(element => {
      if (element.type == 'Facility' || element.type == 'Resource') {
        days = [...days, ...element.days];
      }
    });
    console.log('days', days);
    this.blockedHoursOfOperation = days;
    this.refreshCalendar();

  }

  hasPermission(pm) {
    if (!this.case) return false;
    return this.userSvc.hasPermission(pm);
    // if (!this.case || !this.case.court) return false;
    // let courtOID = this.case.court.courtOID;
    // return this.userSvc.hasPermission(pm, courtOID);
  }

  createHearing(hearingForm) {
    let newHearing = new CaseHearing();
    newHearing.description = 'New hearing description...';
    newHearing.caseId = this.case.caseOID;
    this.selectedHearing = newHearing;
    this.hearings.push(newHearing);
    this.hearings = this.hearings.slice();
    this.initHearingData();
    this.selectedHearing.hearingStartDateTime = new Date();
    this.setWorkWeek(this.selectedHearing.hearingStartDateTime);
    // hearingForm.reset();
    // this.getLookups();
    console.log('hearings', this.hearings);
  }

  hearingOnRowSelect(event) {
    if (!this.hasPermission(this.Permission.UPDATE_CASE_HEARING)) return false;
    if (this.showDeleteHearingModal) return;
    this.setSelectedHearing(event.data);
  }

  setSelectedHearing(h: CaseHearing) {
    this.selectedHearing = h;
    this.setWorkWeek(this.selectedHearing.hearingStartDateTime);
  }

  hearingDateOnChange(event) {
    this.selectedHearing.hearingStartDateTime = event;
    this.setWorkWeek(event);
    this.getUnavailableBlocks();
  }

  hearingJudgeOnChange(event) {
    console.log('hearingJudgeOnChange event', event);
    this.selectedHearing.judicialOfficer = event.value;
    this.selectedHearing.judicialOfficerId = event.value.id;
    console.log('selectedHearing hearingJudgeOnChange', this.selectedHearing);
    this.getUnavailableBlocks();
  }

  hearingLocationOnChange(event) {
    console.log('hearingJudgeOnChange event', event);
    this.selectedHearing.hearingLocation = event.value;
    this.selectedHearing.courtLocationId = event.value.id;
    this.selectedHearing.courtId = event.value.courtId;
    console.log('selectedHearing hearingLocationOnChange', this.selectedHearing);
    this.getUnavailableBlocks();
  }

  hearingStartTimeOnChange(event) {
    // IF END DATE !touched, then set it to the same value as the StartTime
    // this.selectedHearing.startDateTime = event;
  }

  hearingEndTimeOnChange(event) {
    // this.selectedHearing.endDateTime = event;
  }

  hearingTypeOnChange(event) {
    console.log('hearingTypeOnChange event', event);
    // TODO: Make sure the hearingTypeId is changed with ngModel binding
    this.selectedHearing.hearingType = event.value;
    this.selectedHearing.hearingTypeId = event.value.id;
    console.log('selectedHearing hearingTypeOnChange', this.selectedHearing);
  }

  hearingDescriptionOnChange(event) {
    // TODO: Check to see if selectedHearing.description is changed with ngModel binding
    this.selectedHearing.description = event;
  }

  onCancelEditHearing(hearingForm) {
    // hearingForm.reset();
    this.hideModals();
  }

  saveHearing() {
    let h = this.selectedHearing
    if (!h.courtLocationId || !h.hearingTypeId || !h.judicialOfficerId) {
      this.toastSvc.showInfoMessage('Please complete all fields and try again.');
      return;
    }
    if (!h.days || !h.days.length) {
      this.toastSvc.showInfoMessage('Please add a hearing time block by click & drag on the calendar.');
      return;
    }

    this.hearingSvc
      .save(h)
      .subscribe(result => {
        let resultHearing = result;

        // Get Index of Selected Hearing
        let index: number = this.hearings.findIndex(a => a == this.selectedHearing);

        if (index >= 0) {
          this.hearings[index] = resultHearing;
        } else {
          this.hearings.push(resultHearing);
        }
        this.initHearingData();
        this.hearings = this.hearings.slice();

        console.log('hearings after save', this.hearings);
        this.toastSvc.showSuccessMessage('Hearing Saved');
      },
        (error) => {
          console.log(error);
          this.toastSvc.showErrorMessage('There was an error while saving hearings.')
        },
        () => {
          // final
        });

  }


  requestDeleteHearing(event, hearing: CaseHearing): void {
    this.showDeleteHearingModal = true;
    event.preventDefault();
    this.selectedHearing = hearing;
  }

  deleteHearing(): void {
    CollectionUtil.removeArrayItem(this.hearings, this.selectedHearing);
    this.hearings = this.hearings.slice();
    this.showDeleteHearingModal = false;
    // TODO: Get deleteHearing EP from Aaron
    // SETUP DELETE HEARING SERVICE
  }

  setWorkWeek(e) {
    console.log('setWorkWeek(e)', e)
    this.selectedWorkWeek = this.getMonday(new Date(e).toDateString());
    this.scheduler.control.startDate = this.selectedWorkWeek;
    this.scheduler.control.update();
    this.getUnavailableBlocks();
    console.log('selectedWorkWeek', this.selectedWorkWeek);
  }

  saveItem() {
    // console.log('BEFORE Save RESOURCE:', this.selectedResource);
  }

  cancelDataItemEdit(event) {
    this.selectedHearing = Object.assign(new CaseHearing(), this.selectedHearingBak);
    // this.resources[this.selectedResourceIdx] = this.selectedResource;
  }

  deleteDataItemRequest() {
    this.showDeleteItemModal = true;
  }

  deleteDataItem() {
    // this.calResourceSvc.delete(this.selectedResource.id)
    //   .subscribe(result => {
    //     this.toastSvc.showSuccessMessage('The item has been deleted.');
    //     this.resources.splice(this.getIndexOfItem(), 1);
    //     this.selectedResource = this.resources[0];
    //     this.hideModals();
    //   },
    //     (error) => {
    //       console.log(error);
    //       this.toastSvc.showErrorMessage('There was an error deleting the item.');
    //     },
    //     () => {
    //       // final
    //     })
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

  }


  // TODO: Move to util lib
  private genLongId() {
    return Math.round((Math.random() * 10000000000000000))
  }

  // TODO: move to util lib
  private getMonday(date = new Date().toDateString()) {
    console.log('date', date)
    // '2018-11-10T08:30:00'
    let d = new Date(date);
    let diff = (d.getDate() - d.getDay()) + 1;

    return new Date(d.setDate(diff));
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


  private copySelectedItem() {
    this.selectedHearingBak = Object.assign({}, this.selectedHearing);
    // this.selectedResourceIdx = this.getIndexOfItem(this.selectedResource);
  }

  private getIndexOfItem(item = this.selectedHearing): number {
    return this.hearings
      .findIndex(itm => itm.id == item.id);
  }

}
