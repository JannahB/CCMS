import { IccsCode } from './IccsCode';
import { CasePhase } from './CasePhase';
import { ChargeFactor } from './ChargeFactor';
import {ChargeFactorVariable} from './ChargeFactorVariable';
import { CaseType } from './CaseType';
import { TaskType } from './TaskType';
import { CaseStatus } from './CaseStatus';
import { CasePartyRole } from './CasePartyRole';
import { HearingType } from './HearingType';
import { Role } from './Role';
import { StaffRole } from './StaffRole';
import { EventType } from './EventType';
import { CourtLocation } from './CourtLocation';

export class Court {

  casePartyRoles: CasePartyRole[];
  casePhases: CasePhase[]; 
  caseStatuses: CaseStatus;
  caseTaskTypes: TaskType[];
  caseTypes: CaseType[];
  chargeFactors: ChargeFactor[];
  chargeFactorVariable: ChargeFactorVariable[];
  courtLocations: CourtLocation[];
  courtName: string; 
  courtOID: number; 
  eventTypes: EventType[];
  hearingTypes: HearingType[];
  iccsCodes: IccsCode[];
  locationCode: string; 
  personIDTypes: any[];         // Entity NEEDED //
  roles: Role[];
  staffRoles: StaffRole[];

}