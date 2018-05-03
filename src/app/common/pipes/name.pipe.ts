import { Pipe, PipeTransform } from '@angular/core';
import { Party } from '../entities/Party';

@Pipe({ name:'name' })
export class NamePipe implements PipeTransform{

    transform(party:Party){
        if(!party){
            return "";
        }

        return `${party.firstName} ${party.lastName}`;
    }

}
