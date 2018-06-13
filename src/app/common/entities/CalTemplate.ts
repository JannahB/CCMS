import { CalTemplateTime } from "./CalTemplateTime";

export class CalTemplate {

  id: number = null;
  name: string = '';
  description: string = '';
  courtOID: number = 5; // TODO: REMOVE 5 WHEN CAPTURING COURTOID IN CONTROLLER
  days: CalTemplateTime;

}
