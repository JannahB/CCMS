import { Sentencing } from "./Sentencing";

export class CriminalCharge extends Sentencing {
  chargeId: number = null;
  chargeReference: string = '';
  lawEnforcementId: string = '';
  charge: string = '';
  chargeDocumentURL: string = '';
  chargeUNCode: string = '';
  chargeEnhancements: string = '';
  chargeDate: Date = new Date();
}
