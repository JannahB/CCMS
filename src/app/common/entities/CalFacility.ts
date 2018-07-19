import { CalFacilityTag } from './CalFacilityTag';
import { CalFacilityTime } from "./CalFacilityTime";

export class CalFacility {

  id: number = null;
  name: string = '';
  description: string = '';
  court: number = 5; // TODO: REMOVE 5 WHEN CAPTURING COURTOID IN CONTROLLER
  tags: CalFacilityTag[] = [];
  days: CalFacilityTime[] = [];
  week: Date = new Date();

}
