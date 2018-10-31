import { ChargeFactor } from './ChargeFactor';
import { ChargeFactorVariable } from './ChargeFactorVariable';//RS
import { ChargeFactorCategory } from './ChargeFactorCategory';
import { LocalCharge } from './LocalCharge';
import { IccsCode } from './IccsCode';

export class CaseCharge {

  caseChargeOID: number = 0; 
  caseOID: number = 0; 
  courtOID: number = 0; 
  iccsChargeCategoryOID: number = 0; 
  iccsCode: IccsCode = null;
  leaChargingDetails: string = ""; 
  localCharge: LocalCharge = null;

  chargeFactors: ChargeFactor[];
  chargeFactorVariables: ChargeFactorVariable[]; //RS
  chargeFactorCategory: ChargeFactorCategory[];//RS
}