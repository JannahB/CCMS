import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { Case } from "../../../common/entities/Case";
import { CourtLocation } from "../../../common/entities/CourtLocation";
import { HearingType } from "../../../common/entities/HearingType";
import { JudicialOfficer } from "../../../common/entities/JudicialOfficer";
import { Permission } from "../../../common/entities/Permission";

import { CalendarUtils } from "../../../common/utils/calendar-utils";
import { CollectionUtil } from "../../../common/utils/collection-util";
import { BreadcrumbService } from "../../../breadcrumb.service";
import { HearingsService } from "./../../../common/services/http/hearings.service";
import { ToastService } from "../../../common/services/utility/toast.service";
import { UserService } from "../../../common/services/utility/user.service";
import { CaseHearingTimesDTO } from "../../../common/entities/CaseHearingTimesDTO";
import { TempHearing } from "../../../common/entities/TempHearing";
import { AppStateService } from "../../../common/services/state/app.state.sevice";
import { AuthorizedCourt } from "../../../common/entities/AuthorizedCourt";
import { Party } from "../../../common/entities/Party";
import { Court } from "../../../common/entities/Court";
import { CaseRegisterService } from "../../../common/services/http/case-register.service";
import { RegisterEntry } from "../../../common/entities/RegisterEntry";
import { CaseService } from "../../../common/services/http/case.service";
import { CaseEvent } from "../../../common/entities/CaseEvent";
import { NgForm } from "@angular/forms";
import { ConflictedHearing } from "../../../common/entities/ConflictedHearing";

@Component({
  selector: "app-temp-hearings",
  templateUrl: "./temp-hearings.component.html",
  styleUrls: ["./temp-hearings.component.scss"]
})
export class TempHearingsComponent implements OnInit, OnDestroy {
  @Input() case: Case;
  @Output() caseChange = new EventEmitter<Case>();

  @Input() filteredEvents: CaseEvent[];
  @Output() filteredEventsChange = new EventEmitter<CaseEvent[]>();

  public Permission: any = Permission;
  hearings: TempHearing[];
  judges: JudicialOfficer[];
  selectedHearing: TempHearing = new TempHearing();
  selectedHearingBak: TempHearing;
  selectedHearingIdx: number;
  loadingDataFlag = false;
  hearingLocations: CourtLocation[];
  hearingTypes: HearingType[];
  hearingSubscription: Subscription;
  hearingStartDateTime: Date;
  hearingEndDateTime: Date;

  showModalAddHearing = false;
  loadingHearingLookups = false;
  hearingConflicts: TempHearing[] = [];
  loadingConflicts = false;
  showDeleteHearingModal = false;

  allCourts: Court[];
  selectedCourt: AuthorizedCourt;
  courts: AuthorizedCourt[];
  loggedInUser: Party;
  high: number;
  low: number;

  constructor(
    private toastSvc: ToastService,
    private userSvc: UserService,
    private hearingSvc: HearingsService,
    private caseRegSvc: CaseRegisterService,
    private caseSvc: CaseService,
    private appState: AppStateService
  ) { }

  ngOnInit() {
    this.getLookups();
    this.hearings = [];
  }

  ngOnDestroy() {
    if (this.hearingSubscription) {
      this.hearingSubscription.unsubscribe();
    }
  }

  getLookups() {
    this.loadingDataFlag = true;
    const source = Observable.forkJoin<any>(
      this.hearingSvc.getJudicialOfficer(),
      this.hearingSvc.getCourtLocations(),
      this.hearingSvc.getHearingTypes(),
      this.hearingSvc.getCourts()
    );
    this.hearingSubscription = source.subscribe(
      results => {
        this.judges = results[0] as JudicialOfficer[];
        this.hearingLocations = results[1] as CourtLocation[];
        this.hearingTypes = results[2] as HearingType[];
        this.allCourts = results[3] as Court[];
        this.enhanceJudges();
        this.getHearings();
        this.enhanceLocations();
        // this.filterHearingTypes();
      },
      error => {
        // console.log("getLookups error", error);
        this.toastSvc.showErrorMessage(
          "There was an error fetching hearing reference data."
        );
      },
      () => {
        this.loadingDataFlag = false;
      }
    );
  }

  getConflicts() {

  }

  private enhanceJudges() {
    this.judges.map(j => (j.name = j.firstName + " " + j.lastName)); // concat first and last name
  }

  private enhanceLocations() {
    this.hearingLocations.forEach(location => {
      location.fullcourtroom =
        location.courtroom +
        " at " +
        this.allCourts.find(court => court.id === location.courtId).courtName;
    });
  }

  setSelectedCourt() {
    this.loggedInUser = this.userSvc.loggedInUser;
    this.courts = this.loggedInUser.authorizedCourts;
    this.selectedCourt =
      this.appState.selectedCourt || this.loggedInUser.authorizedCourts[0];
  }

  getHearings(resultHearing?) {
    this.loadingDataFlag = true;
    this.hearingSvc.getTempByCaseId(this.case.caseOID).subscribe(
      data => {
        this.hearings = data;
        this.hearings = this.hearings.slice();
        if (this.hearings.length) {
          this.initHearingData();
          const selectedIndex = resultHearing
            ? this.getIndexOfItem(resultHearing)
            : 0;
          this.setSelectedHearing(this.hearings[selectedIndex]);
        } else {
        }
      },
      error => {
        console.log("getHearings error", error);
        this.toastSvc.showErrorMessage("There was an error fetching hearings.");
      },
      () => {
        this.loadingDataFlag = false;
      }
    );
  }

  private getIndexOfItem(item = this.selectedHearing): number {
    return this.hearings.findIndex(itm => itm.id === item.id);
  }

  initHearingData() {
    // Loop thru caseHearings and append properties
    this.hearings.map(h => (h = this.enhanceAHearing(h)));
  }

  hearingOnRowSelect(event) {
    if (!this.hasPermission(this.Permission.UPDATE_CASE_HEARING)) {
      return false;
    }
    if (this.showDeleteHearingModal) {
      return;
    }
    this.setSelectedHearing(event.data);
    this.showModalAddHearing = true;
  }

  hasPermission(pm) {
    if (!this.case) {
      return false;
    }
    return this.userSvc.hasPermission(pm);
    // if (!this.case || !this.case.court) return false;
    // let courtOID = this.case.court.courtOID;
    // return this.userSvc.hasPermission(pm, courtOID);
  }

  setSelectedHearing(h?: TempHearing) {
    if (!h) {
      this.createHearing();
      return;
    }
    this.selectedHearing = h;
    this.copySelectedItem();
  }
  createHearing() {
    // if new hearing
    if (this.hearings.findIndex(h => h.id === 0) > -1) {
      this.toastSvc.showWarnMessage(
        "Only one new hearing can be created at a time."
      );
      return;
    }

    const newHearing = new TempHearing();
    newHearing.id = 0;
    newHearing.description = "New hearing description...";
    newHearing.caseId = this.case.caseOID;
    this.selectedHearing = newHearing;

    this.hearings.push(this.selectedHearing);
    this.hearings = this.hearings.slice();
    this.enhanceAHearing(newHearing);
    this.selectedHearing.hearingDate = new Date();
    this.copySelectedItem();
  }

  private copySelectedItem() {
    this.selectedHearingBak = Object.assign({}, this.selectedHearing);
    this.selectedHearingIdx = this.getIndexOfItem(this.selectedHearing);
  }

  hearingDateOnChange(event) {
    this.selectedHearing.hearingDate = event;
    if (this.selectedHearing.judicialOfficerId) {
      const hearingDate = this.selectedHearing.hearingDate.format("yyyy-mm-dd", true);
      this.hearingSvc.getConflicts(this.selectedHearing.judicialOfficerId, hearingDate)
        .subscribe(results => {
          this.hearingConflicts = results;
          // this.hearingConflicts = this.hearingConflicts.slice();
          this.enhanceConflicts();
        });

    }
  }

  startTimeOnChange(event) {
    this.selectedHearing.startDateTime = event;
  }

  endTimeOnChange(event) {
    this.selectedHearing.endDateTime = event;
  }

  showHearingModal() {
    this.showModalAddHearing = true;

    const newHearing = new TempHearing();
    newHearing.caseId = this.case.caseOID;
    this.selectedHearing = newHearing;
    this.selectedHearing.hearingDate = new Date();
    this.selectedHearing.startDateTime = new Date();
    this.selectedHearing.endDateTime = new Date();
  }

  hearingJudgeOnChange(event) {
    // console.log("hearingJudgeOnChange event", event);
    // console.log("selectedHearing hearingJudgeOnChange", this.selectedHearing);
    this.selectedHearing.judicialOfficer = event.value;
    this.selectedHearing.judicialOfficerId = event.value.id;
    if (this.selectedHearing.hearingDate) {
      const hearingDate = this.selectedHearing.hearingDate.format("yyyy-mm-dd", true);
      this.hearingSvc.getConflicts(this.selectedHearing.judicialOfficerId, hearingDate)
        .subscribe(results => {
          this.hearingConflicts = results;
          // this.hearingConflicts = this.hearingConflicts.slice();
          this.enhanceConflicts();
        });
    }
  }

  private enhanceAHearing(h: TempHearing): TempHearing {
    h.judicialOfficer = this.judges.find(j => j.id === h.judicialOfficerId);
    h.hearingType = this.hearingTypes.find(ht => ht.id === h.hearingTypeId);
    h.hearingLocation = this.hearingLocations.find(
      loc => loc.id === h.courtLocationId
    );
    return h;
  }

  private enhanceConflicts() {
    this.hearingConflicts.forEach(hearing => this.enhanceAHearing(hearing));
  }

  hearingLocationOnChange(event) {
    this.selectedHearing.hearingLocation = event.value;
    this.selectedHearing.courtLocationId = event.value.id;
    this.selectedHearing.courtId = event.value.courtId;
  }

  hearingTypeOnChange(event) {
    // TODO: Make sure the hearingTypeId is changed with ngModel binding
    this.selectedHearing.hearingType = event.value;
    this.selectedHearing.hearingTypeId = event.value.id;
  }

  hearingDescriptionOnChange(event) {
    // TODO: Check to see if selectedHearing.description is changed with ngModel binding
    this.selectedHearing.description = event;
  }

  onCancelEditHearing(hearingForm) {
    if (this.selectedHearing.id === 0) {
      CollectionUtil.removeArrayItem(this.hearings, this.selectedHearing);
      this.hearings = this.hearings.slice();
      this.selectedHearing = null;
    } else {
      this.selectedHearing = this.selectedHearingBak;
    }
    this.hideModal();
  }

  hideModal() {
    this.showModalAddHearing = false;
    // this.router.navigate(['/case-detail', this.case.caseOID], {fragment: 'test'});
  }

  public updateRegister() {
    const currCaseOID: string = (this.case.caseOID as any) as string;
    // console.log(currCaseOID);
    this.caseSvc.fetchOne(currCaseOID).subscribe(
      kase => {
        this.filteredEventsChange.emit(kase.caseEvents);
        this.toastSvc.showInfoMessage("Case register updated");
      },
      error => {
        console.log(error);
      },
      () => {
        // done
      }
    );
  }

  saveHearing(form: NgForm) {
    const hearing = this.selectedHearing;

    const hearingTypeName: string = hearing.hearingType.name;

    // register entry save
    const regEntry: RegisterEntry = new RegisterEntry();
    regEntry.description = "Hearing created [" + hearingTypeName + "]";
    regEntry.caseOID = this.case.caseOID as any as string;
    regEntry.eventTypeName = "UPTD";

    console.log(hearing);

    this.caseRegSvc
      .save(regEntry)
      .subscribe(result => {
        this.updateRegister();
      },
        (error) => {
          console.log(error);
        },
        () => {
          // final
        });

    this.hearingSvc
      .tempSave(hearing)
      .subscribe(result => {
        this.getHearings(result);
        this.toastSvc.showSuccessMessage("Hearing Saved");
      },

        error => {
          console.log(error);
          this.toastSvc.showErrorMessage(
            "There was an error while saving this hearing."
          );
        },
        () => {
          // final
        }
      );
    this.hideModal();
  }
}
