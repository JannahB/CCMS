import { Injectable } from '@angular/core';
import { DateParserService } from './date-parser.service';

@Injectable()
export class DateValidatorService {

    public static readonly dateParser:DateParserService = new DateParserService();

    public static readonly dateRegExp:RegExp = /^\d{1,2}-[a-zA-Z]{3}-\d{4}$/;

    public isDate(possibleDate:any):boolean{
        return possibleDate instanceof Date && !isNaN(possibleDate.valueOf());
    }

    public isValidDDMMMYYYYDateString(dateString:string):boolean{
        dateString = dateString.trim();

        if(!DateValidatorService.dateRegExp.test(dateString)){
            return false;
        }

        try{
            DateValidatorService.dateParser.parseDate(dateString);

            return true;
        }catch(exception){
            return false;
        }
    }

}
