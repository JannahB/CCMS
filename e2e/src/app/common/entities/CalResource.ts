import { CalResourceTime } from './CalResourceTime';

export class CalResource {

  id: number = null;
  name: string = '';
  description: string = '';
  court: number = 5; // TODO: REMOVE 5 WHEN CAPTURING COURTOID IN CONTROLLER
  days: CalResourceTime[] = [];
  week: Date = new Date();

}
