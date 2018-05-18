import { Party } from './Party';

export class Pool {

  id: number;
  poolOID: number;
  poolName: string;
  courtOID: number;
  poolStaffParties: Party[] = [];

}
