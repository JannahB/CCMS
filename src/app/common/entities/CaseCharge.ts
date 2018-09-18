import { ChargeFactor } from './ChargeFactor';
import { ChargeFactorVariable } from './ChargeFactorVariable';
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

  //RS Define an array of charge Factor Variables
  chargeFactorVariables: ChargeFactorVariable[]; 
}