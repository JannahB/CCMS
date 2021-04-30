import { IccsCode } from "./IccsCode";

export class LocalCharge {

  categoryIdentifier: string; 
  courtOID: number; 
  localCharge: string; 
  localChargeOID: number; 
  localLaw: string; 
  parentOID: number; 
  charge_weight: number;

  parentICCSCode: IccsCode;
  
}