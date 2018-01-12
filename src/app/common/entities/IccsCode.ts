import { LocalCharge } from "./LocalCharge";


export class IccsCode {

  categoryIdentifier: string; 
  categoryName: string;
  categoryType: number; 
  courtOID: number; 
  iccsCodeOID: number; 
  localCharges: LocalCharge[]; 
  parentOID: number; 
  
}