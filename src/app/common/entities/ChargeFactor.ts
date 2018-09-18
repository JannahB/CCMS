export class ChargeFactor {

  courtOID: number; 
  chargeFactorOID: number; 
  description: string;
  name: string; 
  disaggregationID: number; //RS declare in the DB as an INT, not sure if it would crash.
}