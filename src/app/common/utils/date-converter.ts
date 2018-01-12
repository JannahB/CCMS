import { DateValidatorService } from '../services/utility/dates/date-validator.service';

export class DateConverter{

    private static readonly dateValidator:DateValidatorService = new DateValidatorService();

    public static convertDate(potentialDate:any):Date{
        //It is already a date
        if(this.dateValidator.isDate(potentialDate)){
            return potentialDate;
        }

        //It is a correctly formatted date string
        let date = new Date(Date.parse(potentialDate));

        if(this.dateValidator.isDate(date)){
            return date;
        }

        //There will probably be more validation options
        return null;
    }

}
