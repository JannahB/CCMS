import { IccsCode } from "./IccsCode";

export class LocalCharge {

  categoryIdentifier: string; 
  courtOID: number; 
  localCharge: string; 
  localChargeOID: number; 
  localLaw: string; 
  parentICCSCode: IccsCode;
  
}