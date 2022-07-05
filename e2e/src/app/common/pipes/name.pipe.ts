import { Pipe, PipeTransform } from '@angular/core';
import { Party } from '../entities/Party';

@Pipe({ name: 'name' })
export class NamePipe implements PipeTransform {

    transform(party: Party) {

        if (!party) {
            return "";
        }

        if (party.fullName && party.fullName !== "null null") {
          return party.fullName;
        }

        if (party.firstName || party.lastName) {

          const firstName = party.firstName ? party.firstName : "";
          const lastName = party.lastName ? party.lastName : "";

          return `${firstName} ${lastName}`.trim();
        }

        return "";
    }

}
