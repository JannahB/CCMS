import { Injectable } from '@angular/core';
import { ParseException } from '../../../utils/exceptions/parse-exception';

@Injectable()
export class DateParserService {

    /**
     * Parses a date from dd-mmm-yyyy string format into a Date object
     * Throws a parse exception if the string does not parse
     */
    public parseDate(dateString:string):Date{
        try{
            dateString = dateString.trim();

            let months:any = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};

            let dateParts:string[] = dateString.split('-');

            let date:Date = new Date(parseInt(dateParts[2]), months[dateParts[1].toLowerCase()], parseInt(dateParts[0]));

            if(isNaN(date.valueOf())){
                throw new ParseException(`Failed to parse date: Resulting value is not a valid date.`, dateString);
            }

            return date;
        }catch(exception){
            throw new ParseException(`Failed to parse date: ${exception.message}`, dateString);
        }
    }

}
