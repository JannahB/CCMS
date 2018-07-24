import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSelectionList, MatSelectionListChange } from "@angular/material";
import { DayPilot, DayPilotSchedulerComponent } from "daypilot-pro-angular";
import * as moment from "moment";
import { Calendar } from "../../../../../node_modules/primeng/primeng";
import { CalFacility } from "../../../common/entities/CalFacility";
import { CalTemplate } from "../../../common/entities/CalTemplate";
import { Holiday } from "../../../common/entities/Holiday";
import { HolidayService } from "../../../common/services/holiday.service";
import { BreadcrumbService } from "./../../../breadcrumb.service";
import { CalFacilityTag } from "./../../../common/entities/CalFacilityTag";
import { CalFacilityService } from "./../../../common/services/http/calFacility.service";
import { ToastService } from "./../../../common/services/utility/toast.service";

@Component({
  selector: "app-holidays",
  templateUrl: "./holidays.component.html",
  styleUrls: ["./holidays.component.scss"]
})
export class HolidaysComponent implements OnInit {
  @ViewChild("endDateCalendar") endDateCalendar: Calendar;

  holidays: Holiday[] = [];
  selectedHoliday: Holiday = null;

  searchText: String;

  //Model properties
  public name: string;
  public startDate: Date;
  public endDate: Date;

  constructor(
    private calFacilitySvc: CalFacilityService,
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
  }

  ngOnInit() {
    //TODO: add loading bar
    //TODO: add exception handler
    this.holidayService
      .getAll()
      .subscribe(holidays => (this.holidays = holidays));

    this.facilities = [];
    this.facilityTags = [
      { id: 1, name: "Jury Room" },
      { id: 2, name: "Near Detention Center" }
    ];
    this.filteredTags = this.facilityTags;

    // Handle mat-selection-list selection change via dom element so we can DeselectAll
    this.matSelectionList.selectionChange.subscribe(
      (event: MatSelectionListChange) => {
        this.matSelectionList.deselectAll();
        event.option.selected = true;
        this.selectedFacility = event.option.value;
        this.copySelectedItem();
      }
    );

    this.selectedFacility = new CalFacility();
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
    this.endDate = startDate.add(holiday.span - 1, "days").toDate();
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

    this.selectedHoliday.name = this.name;
    this.selectedHoliday.day = startDateMoment.format("YYYY-MM-DD");
    this.selectedHoliday.span = endDateMoment.diff(startDateMoment, "days") + 1;

    if (this.selectedHoliday.id) {
      this.holidayService.put(this.selectedHoliday).subscribe(result => {
        this.reset();
      });
      this.reset();
    } else {
      this.holidayService.post(this.selectedHoliday).subscribe(result => {
        this.holidays.push(result);
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
      this.reset();
      this.showDeleteItemModal = false;
    });
  }

  reset() {
    this.name = "";
    this.startDate = null;
    this.endDate = null;
    this.selectedHoliday = null;
  }

  //#region This all looks like copy pasta

  @ViewChild("scheduler") scheduler: DayPilotSchedulerComponent;

  @ViewChild(MatSelectionList) matSelectionList: MatSelectionList;

  facilities: any[] = [];
  selectedFacility: any;
  selectedFacilityBak: any;
  selectedFacilityIdx: number;
  showDeleteItemModal: boolean = false;
  selectedWorkWeek: any;
  facilityTags: any[];
  selectedTags: CalFacilityTag[];
  filteredTags: CalFacilityTag[];

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
    timeHeaders: [{ groupBy: "Hour" }, { groupBy: "Cell", format: "mm" }],
    scale: "CellDuration",
    cellDuration: 30,
    // days: new DayPilot.Date("2017-07-01").daysInMonth(),
    days: 7,
    startDate: "2018-01-01",
    heightSpec: "Max",
    height: 300,
    onTimeRangeSelected: args => {
      DayPilot.Modal.prompt("Create a new task:", "Available").then(function(
        modal
      ) {
        var dp = args.control;
        dp.clearSelection();
        if (!modal.result) {
          return;
        }
        // id: Math.random() * 1000000/1000000,
        dp.events.add(
          new DayPilot.Event({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            resource: args.resource,
            text: modal.result
          })
        );
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
      } else {
        str = duration.toString("H:mm");
      }

      args.row.columns[0].html = str + " hours";
    },
    onBeforeEventRender: args => {
      var duration = new DayPilot.Duration(args.data.start, args.data.end);
      args.data.areas = [
        {
          right: 2,
          top: 6,
          height: 20,
          width: 30,
          html: duration.toString("h:mm")
        }
      ];
    },
    onBeforeResHeaderRender: args => {
      let dow = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      // console.log("args.resource.html", args.resource);

      // To Show day of week only use
      // args.resource.html = dow[args.resource.index];

      // To Show Day & Date use
      args.resource.html = dow[args.resource.index] + " " + args.resource.html;

      if (args.resource.loaded === false) {
        args.resource.html += " (loaded dynamically)";
        args.resource.backColor = "gray";
      }
    },
    eventMoveHandling: "Update",
    onEventMoved: args => {
      console.log("move", args);
      // this.message("Event moved");
    },
    eventResizeHandling: "Update",
    onEventResized: args => {
      console.log("resize", args);
      // this.message("Event resized");
    },
    eventDeleteHandling: "Update",
    onEventDeleted: args => {
      // delete TemplateTime data.id
      this.calFacilitySvc
        .deleteFacilityTimeBlock(args.e.data.id)
        .subscribe(result => {
          this.toastSvc.showInfoMessage("Time block deleted.");
        });
      console.log("delete", args);
    }
  };

  ngOnDestroy() {
    // if (this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    var from = this.scheduler.control.visibleStart();
    var to = this.scheduler.control.visibleEnd();

    this.calFacilitySvc.get().subscribe(result => {
      console.log("facilities", result);
      this.facilities = result;

      this.setFirstListItem();
    });
  }

  createNewFacility() {
    this.matSelectionList.deselectAll();
    this.selectedFacility = new CalFacility();
    this.copySelectedItem();
  }

  saveItem() {
    console.log("1 Saving facility:", this.selectedFacility);

    this.serializeDPDateWithZone();

    if (this.selectedFacility.id) {
      console.log("2 Saving facility:", this.selectedFacility);
      // Update existing item PUT
      this.calFacilitySvc
        .put(this.selectedFacility.id, this.selectedFacility)
        .subscribe(
          result => {
            this.updateList(result);
            this.hideModals();
            this.toastSvc.showSuccessMessage("Item Updated");
          },
          error => {
            console.log(error);
            this.toastSvc.showErrorMessage(
              "There was an error saving the item."
            );
          },
          () => {
            // final
          }
        );
    } else {
      // Add new item POST
      this.calFacilitySvc.post(this.selectedFacility).subscribe(
        result => {
          console.log("result", result);
          this.updateList(result);
          this.hideModals();
          this.toastSvc.showSuccessMessage("Item Saved");
        },
        error => {
          console.log(error);
          this.toastSvc.showErrorMessage("There was an error saving the item.");
        },
        () => {
          // final
        }
      );
    }
  }

  cancelDataItemEdit(event) {
    this.selectedFacility = Object.assign(
      new CalTemplate(),
      this.selectedFacilityBak
    );
    this.facilities[this.selectedFacilityIdx] = this.selectedFacility;
  }

  deleteDataItemRequest() {
    // if(!this.allowDeleteItems) {
    //   this.toastSvc.showInfoMessage('Delete support is currently not available.');
    //   return;
    // }
    this.showDeleteItemModal = true;
  }

  deleteDataItem() {
    this.calFacilitySvc.delete(this.selectedFacility.id).subscribe(
      result => {
        this.toastSvc.showSuccessMessage("The item has been deleted.");
        this.facilities.splice(this.getIndexOfItem(), 1);
        this.selectedFacility = this.facilities[0];
      },
      error => {
        console.log(error);
        this.toastSvc.showErrorMessage("There was an error deleting the item.");
      },
      () => {
        // final
      }
    );
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

  applyToFutureWeeks() {
    // TODO: Handle this
  }

  private serializeDPDateWithZone() {
    // Serialize the Time Blocks before saving
    this.selectedFacility.days.forEach(block => {
      // if a block is new, stretched or moved, the start and/or end date will be
      // converted to a DayPilot.Date which uses '.value' to hold the string date
      if (block.start.value) {
        block.start = block.start.value + "Z";
      }
      if (block.end.value) {
        block.end = block.end.value + "Z";
      }
      // if a guid (assigned to new blocks by calendar) then change to a
      // number that will be overwritten by server to a server long type
      if (block.id.length == 36) {
        block.id = Math.round(Math.random() * 10000000000000000);
      }
    });
  }

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
    if (!this.facilities || !this.facilities.length) return;

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
    } else {
      this.facilities.push(result);
    }
  }

  private copySelectedItem() {
    this.selectedFacilityBak = Object.assign({}, this.selectedFacility);
    this.selectedFacilityIdx = this.getIndexOfItem(this.selectedFacility);
  }

  private getIndexOfItem(item = this.selectedFacility): number {
    return this.facilities.findIndex(itm => itm.id == item.id);
  }
  //#endregion
}
