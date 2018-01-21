import { Party } from "./Party";

export class JudicialOfficer extends Party {
    public get name():string{
        return `${this.firstName} ${this.lastName}`;
    }
}