import { Component, Input, OnInit, OnDestroy, Output, EventEmitter,OnChanges } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Minute } from "../../../../common/entities/Minute";
import { Case } from "../../../../common/entities/Case";
import { CaseEventDTO } from "../../../../common/entities/CaseEventDTO";

import { CollectionUtil } from "../../../../common/utils/collection-util";
import { ToastService } from "../../../../common/services/utility/toast.service";
import { MinuteService } from "../../../../common/services/http/minute.service";
import { UserService } from "../../../../common/services/utility/user.service";
import { JudicialOfficer } from "../../../../common/entities/JudicialOfficer";
import { HearingsService } from "../../../../common/services/http/hearings.service";
import { Router } from "@angular/router";
import { TempHearing } from "../../../../common/entities/TempHearing";
import { HearingType } from "../../../../common/entities/HearingType";
import { NgForm } from "@angular/forms";
import { CaseParty } from "../../../../common/entities/CaseParty";
import { CaseService } from "../../../../common/services/http/case.service";
import { EventService } from "../../../../common/services/http/event.service";

import { min } from "rxjs/operators";
import { CaseEvent } from "../../../../common/entities/CaseEvent";
import { EventType } from "../../../../common/entities/EventType";
import { CaseRegisterService } from "../../../../common/services/http/case-register.service";
import { RegisterEntry } from "../../../../common/entities/RegisterEntry";

import { NamePipe } from "../../../../common/pipes/name.pipe";

@Component({
  selector: "app-minutes",
  templateUrl: "./minutes.component.html",
  styleUrls: ["./minutes.component.scss"]
})
export class MinutesComponent implements OnInit, OnDestroy {
  @Input() case: Case;
  @Output() caseChange = new EventEmitter<Case>();

  @Input() filteredEvents: CaseEvent[];
  @Output() filteredEventsChange = new EventEmitter<CaseEvent[]>();

  // public Permission: any = Permission;
  minutes: Minute[];
  judges: JudicialOfficer[];
  selectedJudge: JudicialOfficer;
  minuteSubscription: Subscription;
  caseSubscription: Subscription;
  hearingSubscription: Subscription;
  selectedMinute: Minute = new Minute();
  permissionIsJudge: boolean = false;
  isReadOnly:boolean = false;
  selectedMinuteBak: Minute;
  selectedMinuteIdx: number;
  loadingDataFlag = false;
  showModalAddMinute = false;
  router: Router;
  isEdit = false;
  appearances: String[];
  results: String[];
  witnesses: String[];
  exhibits: String[];

  selectedHearing: TempHearing;
  hearings: TempHearing[];
  hearingsFlag = false;
  hearingTypes: HearingType[];
  filteredCaseParties: String[];

  // filteredEvents: CaseEvent[] = [];
  eventTypeFilter: EventType = null;

  constructor(
    private toastSvc: ToastService,
    private minuteSvc: MinuteService,
    private hearingSvc: HearingsService,
    private caseRegSvc: CaseRegisterService,
    private eventSvc: EventService,
    private userSvc: UserService,
    private caseSvc: CaseService
  ) { }

  ngOnInit() {
    this.getLookups();
    this.minutes = [];

    this.permissionIsJudge = this.userSvc.isJudicialOfficer();
    this.isReadOnly = (this.userSvc.isReadOnlyUser());
    console.log('User is a Judge',this.permissionIsJudge);
  }

  ngOnChanges() {
    this.ngOnInit();
  }

  ngOnDestroy() {
    if (this.minuteSubscription) {
      this.minuteSubscription.unsubscribe();
    }
    if (this.caseSubscription) {
      this.caseSubscription.unsubscribe();
    }
    if (this.hearingSubscription) {
      this.hearingSubscription.unsubscribe();
    }
  }

  createMinute() {
    // if new minute
    if (this.minutes.findIndex(h => h.id === 0) > -1) {
      this.toastSvc.showWarnMessage(
        "Only one new minute can be created at a time."
      );
      return;
    }
    const newMinute = new Minute();
    newMinute.id = 0;
    newMinute.generalMinutes = "General Minute Details...";
    newMinute.caseId = this.case.caseOID;

    this.selectedMinute = newMinute;
    this.minutes.push(this.selectedMinute);
    this.minutes = this.minutes.slice();

    this.selectedMinute.minuteDate = new Date();

    this.copySelectedItem();
    //console.log("minute", this.minutes);
  }

  createEvent() {
    this.enhanceSelectedHearing(this.selectedMinute);
    const minuteEvent = new CaseEventDTO();
    minuteEvent.caseId = this.case.caseOID;
    minuteEvent.courtId = this.case.court.courtOID;
    minuteEvent.eventDate = new Date();
    if (this.isEdit) {
      minuteEvent.description =
        "Minute for " + this.selectedMinute.hearing.hearingName + " updated:";
    } else {
      minuteEvent.description =
        "Minute created for " + this.selectedMinute.hearing.hearingName + ".\n";
    }
    minuteEvent.initiatedByPartyOid = null;
    minuteEvent.eventTypeId = 3027;
    minuteEvent.partyId = this.userSvc.loggedInUser.partyOID;

    return minuteEvent;
  }

  private copySelectedItem() {
    this.selectedMinuteBak = Object.assign({}, this.selectedMinute);
    this.selectedMinuteIdx = this.getIndexOfItem(this.selectedMinute);
  }

  private getIndexOfItem(item = this.selectedMinute): number {
    return this.minutes.findIndex(itm => itm.id === item.id);
  }

  getLookups() {
    this.loadingDataFlag = true;

    const source = Observable.forkJoin<any>(
      this.hearingSvc.getJudicialOfficer(),
      this.minuteSvc.getMinutesByCaseId(this.case.caseOID),
      this.hearingSvc.getTempByCaseId(this.case.caseOID),
      this.hearingSvc.getHearingTypes()
    );
    this.minuteSubscription = source.subscribe(
      results => {
        this.judges = results[0] as JudicialOfficer[];
        this.minutes = results[1] as Minute[];
        this.hearings = results[2] as TempHearing[];
        this.hearingTypes = results[3] as HearingType[];
        this.enhanceJudges();
        this.enhanceMinutes();
        if (this.hearings.length) {
          this.enhanceHearings();
        }
        this.hearingsExist();
      },
      error => {
        console.log("getLookups error", error);
        this.toastSvc.showErrorMessage(
          "There was an error fetching minutes data."
        );
      },
      () => {
        this.loadingDataFlag = false;
      }
    );
  }

  hearingsExist() {
    if (this.hearings && this.hearings.length > 0) {
      this.hearingsFlag = true;
    }
    return this.hearingsFlag;
  }

  hearingJudgeOnChange(event) {
    this.selectedMinute.judicialOfficer = event.value.name;
  }

  hearingOnChange(event) {
    this.selectedMinute.hearingId = event.value.id;
  }

  private enhanceJudges() {
    this.judges.map(j => (j.name = j.firstName + " " + j.lastName)); // concat first and last name
  }

  private enhanceHearings() {
    this.hearingSubscription = this.hearingSvc
      .getTempByCaseId(this.case.caseOID)
      .subscribe(data => {
        this.hearings = data;
        if (this.hearings.length) {
          this.hearings.forEach(hearing => {
            hearing.hearingType = this.hearingTypes.find(
              ht => ht.id === hearing.hearingTypeId
            );
          });
          this.hearings.map(
            h =>
              (h.hearingName =
                h.hearingType.name +
                " on " +
                h.hearingDate.format("d/m/yyyy", true))
          );
        }
      });
  }

  enhanceSelectedHearing(minute?: Minute) {
    if (minute) {
      minute.hearing = this.hearings.find(
        hearing => hearing.id === minute.hearingId
      );
      minute.hearing.hearingType = this.hearingTypes.find(
        ht => ht.id === minute.hearing.hearingTypeId
      );
      minute.hearing.hearingName =
        minute.hearing.hearingType.name +
        " on " +
        minute.hearing.hearingDate.format("d/m/yyyy", true);
    } else {
      this.selectedMinute.hearing = this.hearings.find(
        hearing => hearing.id === this.selectedMinute.hearingId
      );
      this.selectedMinute.hearing.hearingType = this.hearingTypes.find(
        ht => ht.id === this.selectedMinute.hearing.hearingTypeId
      );
      this.selectedMinute.hearing.hearingName =
        this.selectedMinute.hearing.hearingType.name +
        " on " +
        this.selectedMinute.hearing.hearingDate.format("d/m/yyyy", true);
    }
  }

  enhanceMinutes() {
    this.minutes.forEach(minute => this.enhanceSelectedHearing(minute));
  }

  getMinutes(resultMinute?) {
    this.loadingDataFlag = true;
    this.minuteSvc.getMinutesByCaseId(this.case.caseOID).subscribe(
      data => {
        this.minutes = data;
        this.minutes = this.minutes.slice();
        if (this.minutes.length) {
          this.enhanceMinutes();
          const selectedIndex = resultMinute
            ? this.getIndexOfItem(resultMinute)
            : 0;
          this.setSelectedMinute(this.minutes[selectedIndex]);
        } else {
        }
      },
      error => {
        console.log("getMinutes error", error);
        this.toastSvc.showErrorMessage("There was an error fetching minutes.");
      },
      () => {
        this.loadingDataFlag = false;
      }
    );
  }

  search(event) {
    const query = event.query;
    this.filteredCaseParties = this.filterParty(query, this.case.caseParties);
  }

  filterParty(query, parties: CaseParty[]): any[] {
    const filtered: any[] = [];
    const namePipe = new NamePipe();
    for (let i = 0; i < parties.length; i++) {
      const party = parties[i];
      filtered.push(namePipe.transform(party.caseParty));
    }
    return filtered;
  }

  setSelectedMinute(h?: Minute) {
    if (!h) {
      this.createMinute();
      return;
    }
    this.selectedMinute = h;
    this.copySelectedItem();
  }

  minuteOnRowSelect(event): void {
    this.selectedMinute = event.data;
    this.showModalAddMinute = true;
    this.isEdit = true;
    this.enhanceSelectedHearing();
    this.appearances = CollectionUtil.convertToArray(
      this.selectedMinute.appearances
    );
    if (this.selectedMinute.exhibits) {
      this.exhibits = CollectionUtil.convertToArray(
        this.selectedMinute.exhibits
      );
    }
    if (this.selectedMinute.witnesses) {
      this.witnesses = CollectionUtil.convertToArray(
        this.selectedMinute.witnesses
      );
    }
  }

  showMinuteModal() {
    this.showModalAddMinute = true;
    this.isEdit = false;
    const newMinute = new Minute();
    newMinute.caseId = this.case.caseOID;
    this.appearances = null;
    this.exhibits = null;
    this.witnesses = null;
    this.selectedMinute = newMinute;
    this.selectedMinute.minuteDate = new Date();
    this.enhanceHearings();
  }

  onCancelMinute() {
    if (this.selectedMinute.id === null) {
      CollectionUtil.removeArrayItem(this.minutes, this.selectedMinute);
      this.minutes = this.minutes.slice();
    } else {
      this.selectedMinute = this.selectedMinuteBak;
    }
    this.hideModal();
  }

  minuteDateOnChange(event) {
    this.selectedMinute.minuteDate = event;
  }

  hideModal() {
    this.showModalAddMinute = false;
  }

  public updateRegister() {
    const currCaseOID: string = (this.case.caseOID as any) as string;
    console.log(currCaseOID);
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

  saveMinute(form: NgForm) {
    const minute = this.selectedMinute;
    minute.caseId = this.case.caseOID;
    minute.appearances = CollectionUtil.convertToString(this.appearances);
    minute.exhibits = CollectionUtil.convertToString(this.exhibits);
    minute.witnesses = CollectionUtil.convertToString(this.witnesses);
    this.minuteSvc.save(minute).subscribe(
      result => {
        this.getMinutes(result);
        this.toastSvc.showSuccessMessage("Minute Saved");
        /*this.eventSvc.save(this.createEvent()).subscribe(
          event => {
            console.log(event);
            this.updateRegister();
          },
          error => {
            console.log(error);
            this.toastSvc.showErrorMessage(
              "There was an error while updating register."
            );
          }
        );*/
      },
      error => {
        console.log(error);
        this.toastSvc.showErrorMessage(
          "There was an error while saving minutes."
        );
      },
      () => {
        // final
      }
    );
    this.hideModal();
  }
}
