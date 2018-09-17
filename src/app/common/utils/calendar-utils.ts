import { DateValidatorService } from '../services/utility/dates/date-validator.service';
import * as moment from 'moment';

export class CalendarUtils {

  private static readonly dateValidator: DateValidatorService = new DateValidatorService();

  public static calculateAge(dob: Date): number {

    if (!dob || !this.dateValidator.isDate(dob)) return;

    return moment().diff(dob, 'years');
  }

  public static makeDPDateConstructorString(y, m, d, hr, mn): string {
    let str = `${y}-${this.padZero(m + 1)}-${this.padZero(d)}T${this.padZero(hr)}:${this.padZero(mn)}:00`;
    console.log('str', str);
    return str;
  }

  public static padZero(num): string {
    let str: string;
    if (num < 10)
      str = String('0' + num);
    else
      str = String(num);
    return str;
  }

  public static getDateObjByDay(day: number, start: any): Date {
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

  public static getARangeOfDatesAndDays(start, span) {
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

  // public applyToNextWeek() {

  //   let days = this.selectedFacility.days;

  //   // REMOVE TIME BLOCKS IN UPCOMING WEEK
  //   let daysSansNextWeekDays = this.removeDatesWithinASpan(days, this.selectedWorkWeek.addDays(7), 6);
  //   console.log('1. days Sans Next Weeks time blocks', daysSansNextWeekDays);

  //   // FIND TIME BLOCKS IN THIS WEEK DATES TO APPLY TO NEXT WEEK
  //   let newTimeBlocks = this.findDatesWithinASpan(days, this.selectedWorkWeek, 6);
  //   console.log('2. matching Time Blocks', newTimeBlocks);

  //   // CONVERT THIS WEEK'S TIME BLOCKS TO NEXT WEEK TIME BLOCKS
  //   this.convertTimeBlocksToNextWeek(newTimeBlocks);
  //   this.onSelectWorkWeek(this.selectedWorkWeek.addDays(7).toISOString());
  //   this.scheduler.control.update();

  //   setTimeout(() => {
  //     this.saveItem()
  //     this.toastSvc.showInfoMessage('Week Saved!', 'The calendar has advanced to the following week.')
  //   }, 300);
  // }

  // TODO: move to util lib
  public static isWithinRangeByDay(day, start, end) {
    let s = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0);
    let e = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59);
    let d = new Date(day);
    return d >= s && d <= e;
  }

  // TODO: move to util lib
  public static findDatesWithinASpan(arr, start, span) {
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
  public static removeDatesWithinASpan(arr, start, span) {
    let rangeStart = new Date(start);
    let rangeEnd = rangeStart.addDays(span);

    let deletedItems = []; // for debug only

    for (var i = arr.length - 1; i >= 0; i--) {
      if (this.isWithinRangeByDay(arr[i].start, rangeStart, rangeEnd)) {
        deletedItems.push(Object.assign({}, arr[i]));
        // this.deleteTimeBlock(arr[i].id);
        arr.splice(i, 1);
      }
    }
    console.log('Deleted items', deletedItems);
    return arr;
  }

}
