import { DateValidatorService } from '../services/utility/dates/date-validator.service';
import * as moment from 'moment';

export class DateUtils {

  private static readonly dateValidator:DateValidatorService = new DateValidatorService();

  public static calculateAge(dob:Date):number {

    if(!dob || !this.dateValidator.isDate(dob)) return;

    return moment().diff(dob, 'years');
  }

}
