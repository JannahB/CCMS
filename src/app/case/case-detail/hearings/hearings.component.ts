import { Component, Input, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { DayPilot, DayPilotSchedulerComponent } from "daypilot-pro-angular";

import { CaseHearingUnavailableBlock } from './../../../common/entities/CaseHearingUnavailableBlock';
import { CaseHearings } from './../../../common/entities/CaseHearings';
import { HearingsService } from './../../../common/services/http/hearings.service';
import { CaseHearingDeprecated } from './../../../common/entities/CaseHearingDeprecated';
import { CollectionUtil } from '../../../common/utils/collection-util';
import { CaseHearingDTO } from '../../../common/entities/CaseHearingDTO';
import { DatePipe } from '@angular/common';
import { JudicialOfficer } from '../../../common/entities/JudicialOfficer';

import { Case } from '../../../common/entities/Case';
import { CalResource } from '../../../common/entities/CalResource';
import { HearingType } from '../../../common/entities/HearingType';
import { CourtLocation } from '../../../common/entities/CourtLocation';
import { CaseHearing } from '../../../common/entities/CaseHearing';
import { CalResourceTime } from '../../../common/entities/CalResourceTime';
import { Permission } from '../../../common/entities/Permission';

import { BreadcrumbService } from '../../../breadcrumb.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { CaseService } from '../../../common/services/http/case.service';
import { LookupService } from '../../../common/services/http/lookup.service';
import { UserService } from '../../../common/services/utility/user.service';
import { CalResourceService } from "../../../common/services/http/calResource.service";
import { CalTemplateService } from '../../../common/services/http/calTemplate.service';

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
  hearingDate: Date;
  loadingDataFlag: boolean = false;
  hearingLocations: CourtLocation[];
  hearingTypes: HearingType[];
  hearingSubscription: Subscription;
  hearingConflicts: CaseHearingUnavailableBlock[];
  loadingConflicts: boolean = false;
  showDeleteHearingModal: boolean = false;
  judges: JudicialOfficer[];


  hasPermission(pm) {
    if (!this.case) return false;
    return this.userSvc.hasPermission(pm);
    // if (!this.case || !this.case.court) return false;
    // let courtOID = this.case.court.courtOID;
    // return this.userSvc.hasPermission(pm, courtOID);
  }

  createHearing(hearingForm) {
    this.selectedHearing = new CaseHearing();
    // hearingForm.reset();
    // this.getLookups();
  }

  hearingOnRowSelect(event) {

    if (!this.hasPermission(this.Permission.UPDATE_CASE_HEARING)) return false;
    if (this.showDeleteHearingModal) return;
    this.selectedHearing = event.data;
    // this.onShowHearingModal();
  }

  getLookups() {
    this.loadingDataFlag = true;
    var source = Observable.forkJoin<any>(
      // this.lookupSvc.fetchLookup<JudicialOfficer>('FetchJudicialOfficer'),
      // this.lookupSvc.fetchLookup<CourtLocation>('FetchHearingLocation'),
      // this.lookupSvc.fetchLookup<HearingType>('FetchHearingType')
      this.hearingSvc.getJudicialOfficer(),
      this.hearingSvc.getCourtLocations(),
      this.hearingSvc.getHearingTypes(),
    );
    this.hearingSubscription = source.subscribe(
      results => {
        this.judges = results[0] as JudicialOfficer[];
        this.hearingLocations = results[1] as CourtLocation[];
        this.hearingTypes = results[2] as HearingType[];

        this.getHearings();
      },
      (error) => {
        console.log(error);
        this.loadingDataFlag = false;
        this.toastSvc.showErrorMessage('There was an error fetching hearing reference data.')
      },
      () => {
        this.loadingDataFlag = false;
      });
  }

  getHearings() {
    this.hearingSvc.getByCaseId(this.case.caseOID).subscribe(data => {
      this.hearings = data;
      this.initHearingData();
      this.setFirstHearingItem();
    });
  }

  setFirstHearingItem() {
    if (this.hearings && this.hearings.length)
      this.selectedHearing = this.hearings[0]
  }

  initHearingData() {
    this.loadingDataFlag = false;

    // Loop thru caseHearings and append properties
    this.hearings.map(h => h.judicialOfficer = this.judges.find(j => j.id == h.judicialOfficerId));
    this.hearings.map(h => h.hearingType = this.hearingTypes.find(ht => ht.id == h.hearingTypeId));
    this.hearings.map(h => h.hearingLocation = this.hearingLocations.find(loc => loc.id == h.courtLocationId));
    this.hearings.map(h => h.hearingStartDateTime = h.days[0].start);
    this.hearings.map(h => h.hearingEndDateTime = h.days[0].end);

    console.log('hearings', this.hearings);

    // Pre-select Dropdowns
    // if (this.selectedHearing.judicialOfficerId) {
    //   this.selectedHearing.judicialOfficer = this.judges.find(j => j.id == this.selectedHearing.judicialOfficerId);
    // }

    // if (this.selectedHearing.courtLocationId) {
    //   this.selectedHearing.courtLoc = this.hearingLocations.find(h => h.locationOID == this.selectedHearing.courtLoc.locationOID);
    // }

    // if (this.selectedHearing.hearingType) {
    //   this.selectedHearing.hearingType = this.hearingTypes.find(ht => ht.hearingTypeOID == this.selectedHearing.hearingType.hearingTypeOID);
    // }
  }

  getUnavailableFacilityAndResourceBlocks() {

    if (!this.hearingDate
      || !this.selectedHearing.judicialOfficerId
      || !this.selectedHearing.courtLocationId) {

      return;
    }

    this.loadingDataFlag = true;
    this.hearingConflicts = [];
    this.hearingSvc.unavailableFacilityAndResourceBlocks(
      this.hearingDate,
      this.selectedHearing.courtLocationId,
      this.selectedHearing.judicialOfficerId)
      .subscribe(data => {
        this.hearingConflicts = data;
        this.loadingDataFlag = false;
      },
        (error) => {
          console.log(error);
          this.loadingDataFlag = false;
          this.toastSvc.showErrorMessage('There was an error fetching hearing reference data.')
        },
        () => {
          this.loadingDataFlag = false;
        });

    // FetchHearing POST {hearingQueryDate: "2018-01-09", courtLoc: "1"}
    // let hearingDateString: string = this.datePipe.transform(this.selectedHearing.startDateTime, "yyyy-MM-dd");

  }

  hearingDateOnChange(event) {
    this.hearingDate = event;
    this.getUnavailableFacilityAndResourceBlocks();
  }

  hearingJudgeOnChange(event) {
    // TODO: Make sure the judicialOfficerId is changed with ngModel binding
    // this.selectedHearing.judicialOfficer = this.judges.find(j => j.partyOID == event.value);
    this.getUnavailableFacilityAndResourceBlocks();
  }

  hearingLocationOnChange(event) {
    // TODO: Make sure the courtLocationId is changed with ngModel binding
    // this.selectedHearing.courtLoc = event.value;
    this.getUnavailableFacilityAndResourceBlocks();
  }

  hearingStartTimeOnChange(event) {
    // IF END DATE !touched, then set it to the same value as the StartTime
    // this.selectedHearing.startDateTime = event;
  }

  hearingEndTimeOnChange(event) {
    // this.selectedHearing.endDateTime = event;
  }

  hearingTypeOnChange(event) {
    // TODO: Make sure the hearingTypeId is changed with ngModel binding
    // this.selectedHearing.hearingType = event.value;
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
    // let hearing: CaseHearingDTO = new CaseHearingDTO();
    // let sch: CaseHearing = this.selectedHearing;

    // CREATE DTO
    // hearing.caseHearingOID = sch.caseHearingOID ? sch.caseHearingOID.toString() : null;
    // hearing.caseOID = this.case.caseOID.toString();
    // hearing.courtLoc = sch.courtLoc.locationOID.toString();
    // hearing.description = sch.description;
    // hearing.endDateTime = this.datePipe.transform(sch.endDateTime, "yyyy-MM-dd HH:mm");
    // hearing.hearingType = sch.hearingType.hearingTypeOID.toString();
    // hearing.judicialOfficer = sch.judicialOfficer.partyOID.toString(); // this is portyOID since using dropdownPipe
    // hearing.startDateTime = this.datePipe.transform(sch.startDateTime, "yyyy-MM-dd HH:mm");

    /*
    this.caseSvc
      .saveCaseHearing(hearing)
      .subscribe(result => {
        let resultHearing = result[0];

        // Check if existing or new hearing
        let index: number = this.case.caseHearings
          .findIndex(a => a.caseHearingOID == resultHearing.caseHearingOID);

        if (index >= 0) {
          this.case.caseHearings[index] = resultHearing;
        } else {
          this.case.caseHearings.push(resultHearing);
          this.case.caseHearings = this.case.caseHearings.slice();
        }

        console.log('caseHearings', this.case.caseHearings);
        this.toastSvc.showSuccessMessage('Hearing Saved');
      },
        (error) => {
          console.log(error);

          this.toastSvc.showErrorMessage('There was an error while saving hearings.')
        },
        () => {
          // final
        });
    */
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
    eventHeight: 40,
    cellWidthSpec: "Auto",
    timeHeaders: [{ "groupBy": "Hour" }, { "groupBy": "Cell", "format": "mm" }],
    scale: "CellDuration",
    cellDuration: 30,
    // days: new DayPilot.Date("2017-07-01").daysInMonth(),
    days: 7,
    startDate: this.selectedWorkWeek || this.getMonday(),
    heightSpec: "Max",
    height: 350,
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
    private calResourceSvc: CalResourceService,
    private calTemplateSvc: CalTemplateService,
    private breadCrumbSvc: BreadcrumbService,
    private toastSvc: ToastService,
    private userSvc: UserService,
    private caseSvc: CaseService,
    private lookupSvc: LookupService,
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

    let now = moment();
    console.log('hello date', now.format());
    console.log(now.add(7, 'days').format());
  }

  ngOnInit() {

    this.getLookups();

    this.selectedWorkWeek = this.getMonday();

    this.hearings = [];
    // this.hearings =
    //   [
    //     {
    //       "id": null,
    //       "courtId": 0,
    //       "hearingTypeId": 0,
    //       "description": "",
    //       "caseId": 0,
    //       "location": "I see nothing",
    //       "judicialOfficerId": 0,
    //       "courtLocationId": 0,

    //       "hearingType": null,
    //       "judicialOfficer": null,
    //       "hearingLocation": null,
    //       "hearingStartDateTime": "2018-08-30T16:00:00Z",
    //       "hearingEndDateTime": "2018-08-30T16:00:00Z",

    //       "days": [
    //         {
    //           "id": 0,
    //           "start": "2018-08-30T14:00:00Z",
    //           "end": "2018-08-30T15:00:00Z",
    //           "text": "A block 1",
    //           "caseHearingId": null
    //         },
    //         {
    //           "id": 0,
    //           "start": "2018-08-30T16:00:00Z",
    //           "end": "2018-08-30T17:00:00Z",
    //           "text": "Block 2",
    //           "caseHearingId": null
    //         }

    //       ]
    //     }
    //   ]

    this.selectedHearing = new CaseHearing();
  }

  ngOnDestroy() {
    // if (this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    // var from = this.scheduler.control.visibleStart();
    // var to = this.scheduler.control.visibleEnd();

    this.onSelectWorkWeek(this.selectedWorkWeek);
  }


  onSelectWorkWeek(e) {
    console.log('onSelectWorkWeek(e)', e)
    this.selectedWorkWeek = this.getMonday(new Date(e).toDateString());
    this.scheduler.control.startDate = this.selectedWorkWeek;
    this.scheduler.control.update();
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
