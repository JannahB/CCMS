import { ChargeFactor } from './ChargeFactor';
import { LocalCharge } from './LocalCharge';
import { IccsCode } from './IccsCode';

export class CaseCharge {

  caseChargeOID: number; 
  caseOID: number; 
  chargeFactors: ChargeFactor[];
  courtOID: number; 
  iccsChargeCategoryOID: number; 
  iccsCode: IccsCode;
  leaChargingDetails: string; 
  localCharge: LocalCharge;

}