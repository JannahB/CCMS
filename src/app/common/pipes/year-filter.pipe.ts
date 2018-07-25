import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";
import { DateRangeEntity } from "../interfaces/date-range-entity";

@Pipe({ name: "yearFilter" })
export class YearFilterPipe implements PipeTransform {
  transform(items: DateRangeEntity[], year: number): DateRangeEntity[] {
    if (!items) {
      return [];
    }

    if (!year) {
      return items;
    }

    return items.filter(n => n.day && moment(n.day).year() == year);
  }
}
