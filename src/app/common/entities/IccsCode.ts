import { LocalCharge } from "./LocalCharge";


export class IccsCode {

  categoryIdentifier: string; 
  categoryName: string;
  categoryType: number; 
  courtOID: number; 
  iccsCodeOID: number; 
  localCharges: LocalCharge[]; 
  parentOID: number; 
  parentICCSCode: IccsCode;
  
  public static readonly NOT_APPLICABLE:IccsCode = {
    categoryIdentifier: "",
    categoryName: "Not Applicable",
    categoryType: 0,
    courtOID: 0, 
    iccsCodeOID: 0, 
    localCharges: null,
    parentOID: 0,
    parentICCSCode: null
  };
  
  public static readonly UNKNOWN:IccsCode = {
    categoryIdentifier: "",
    categoryName: "Unknown",
    categoryType: 0,
    courtOID: 0, 
    iccsCodeOID: 0, 
    localCharges: null,
    parentOID: 0,
    parentICCSCode: null
  };
  
}