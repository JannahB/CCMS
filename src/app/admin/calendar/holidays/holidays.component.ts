import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSelectionList, MatSelectionListChange } from "@angular/material";
import { DayPilotSchedulerComponent } from "daypilot-pro-angular";
import * as moment from "moment";
import { Calendar, SelectItem } from "primeng/primeng";
import { Holiday } from "../../../common/entities/Holiday";
import { HolidayService } from "../../../common/services/holiday.service";
import { BreadcrumbService } from "../../../breadcrumb.service";
import { ToastService } from "../../../common/services/utility/toast.service";

@Component({
  selector: "app-holidays",
  templateUrl: "./holidays.component.html",
  styleUrls: ["./holidays.component.scss"]
})
export class HolidaysComponent implements OnInit {
  @ViewChild("endDateCalendar") endDateCalendar: Calendar;
  @ViewChild("scheduler") scheduler: DayPilotSchedulerComponent;
  @ViewChild(MatSelectionList) matSelectionList: MatSelectionList;


  holidays: Holiday[] = [];
  selectedHoliday: Holiday = null;
  showDeleteItemModal: boolean = false;
  selectedHolidayBak: any;
  selectedHolidayIdx: number;
  searchText: String;
  filterYears: SelectItem[] = [];
  selectedFilterYear: number = new Date().getFullYear();

  //Model properties
  public name: string = "";
  public startDate: Date = null;
  public endDate: Date = null;

  public isMultiDay: boolean = false;

  constructor(
    private holidayService: HolidayService,
    private breadCrumbSvc: BreadcrumbService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: "Admin Calendars", routerLink: ["/admin/calendar"] },
      { label: "Facility Hours", routerLink: ["/admin/calendar/facilities"] }
    ]);

    let now = moment();
    console.log("hello date", now.format());
    console.log(now.add(7, "days").format());

    let filterYears: SelectItem[] = [];
    let currentYear = new Date().getFullYear();
    for (let index: number = -1; index < 20; index++) {
      let year = currentYear;
      year = year + index;
      filterYears.push({
        label: year.toString(),
        value: year
      });
    }

    this.filterYears = filterYears;
  }

  ngOnInit() {
    //TODO: add loading bar
    //TODO: add exception handler
    this.holidayService
      .getAll()
      .subscribe(holidays => (this.holidays = holidays));

    // Handle mat-selection-list selection change via dom element so we can DeselectAll
    this.matSelectionList.selectionChange.subscribe(
      (event: MatSelectionListChange) => {
        this.matSelectionList.deselectAll();
        event.option.selected = true;
        this.selectedHoliday = event.option.value;
        this.copySelectedItem();
      }
    );

    this.selectedHoliday = new Holiday();
  }

  ngOnDestroy() {
    // if (this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }


  startDateSelected(startDate: Date) {
    if (this.endDate) {
      return;
    }

    this.endDate = this.startDate;
    let selectedMonth: number = startDate.getMonth();
    let selectedYear: number = startDate.getFullYear();
    this.endDateCalendar.currentMonth = selectedMonth;
    this.endDateCalendar.currentYear = selectedYear;
    this.endDateCalendar.createMonth(selectedMonth, selectedYear);
  }

  newClicked() {
    this.reset();
    this.selectedHoliday = new Holiday();
  }

  holidaySelected(change: MatSelectionListChange) {
    let holiday: Holiday = change.option.value;
    this.selectedHoliday = holiday;

    let startDate = moment(holiday.day);

    this.name = holiday.name;
    this.startDate = startDate.toDate();

    if (!holiday.span) {
      this.endDate = this.startDate;
    } else {
      this.endDate = startDate.add(holiday.span - 1, "days").toDate();
    }

    if (this.startDate.getTime() != this.endDate.getTime()) {
      this.isMultiDay = true;
    } else {
      this.isMultiDay = false;
    }
  }

  saveClicked() {
    if (!this.name) {
      this.toastSvc.showWarnMessage("Holiday Name is Required");
      return;
    }

    if (!this.startDate) {
      this.toastSvc.showWarnMessage("Holiday Start Date is Required");
      return;
    }

    if (!this.endDate) {
      this.toastSvc.showWarnMessage("Holiday End Date is Required");
      return;
    }

    let startDateMoment = moment(this.startDate);
    let endDateMoment = moment(this.endDate);

    if (!this.isMultiDay) {
      endDateMoment = startDateMoment;
    }

    this.selectedHoliday.name = this.name;
    this.selectedHoliday.day = startDateMoment.format("YYYY-MM-DD");
    this.selectedHoliday.span = endDateMoment.diff(startDateMoment, "days") + 1;

    if (this.selectedHoliday.id) {
      this.holidayService.put(this.selectedHoliday).subscribe(result => {
        this.reset();
      });
    } else {
      this.holidayService.post(this.selectedHoliday).subscribe(result => {
        //Assign the result id to the new holiday and push the new holiday to the collection
        //because the result will not yet have a name.  Remove this and just use the result
        //when "name" is added server side
        this.selectedHoliday.id = result.id;
        this.holidays.push(this.selectedHoliday);
        this.holidays = this.holidays.copy();
        //this.holidays.push(result);
        this.reset();
      });
    }
  }

  deleteClicked() {
    this.showDeleteItemModal = true;
  }

  deleteConfirmationClicked() {
    this.holidayService.delete(this.selectedHoliday.id).subscribe(result => {
      this.holidays.remove(this.selectedHoliday);
      this.holidays = this.holidays.copy();
      this.reset();
      this.showDeleteItemModal = false;
    });
  }

  reset() {
    this.name = "";
    this.startDate = null;
    this.endDate = null;
    this.selectedHoliday = null;
    this.isMultiDay = false;
  }


  hideModals() {
    this.showDeleteItemModal = false;
  }

  private copySelectedItem() {
    this.selectedHolidayBak = Object.assign({}, this.selectedHoliday);
    this.selectedHolidayIdx = this.getIndexOfItem(this.selectedHoliday);
  }

  private getIndexOfItem(item = this.selectedHoliday): number {
    return this.holidays.findIndex(itm => itm.id == item.id);
  }

}
