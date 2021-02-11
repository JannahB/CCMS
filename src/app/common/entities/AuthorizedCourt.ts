import { LookupEntity } from './base/lookup-entity';
import { Identifier } from './Identifier';
import { ChargeFactor } from './ChargeFactor';
import { ChargeFactorVariable } from './ChargeFactorVariable';
import { ChargeFactorCategory } from './ChargeFactorCategory';
import { CaseEvent } from './CaseEvent';
import { CasePartyRole } from './CasePartyRole';
import { CaseType } from './CaseType';
import { CaseStatus } from './CaseStatus';
import { Role } from './Role';
import { StaffRole } from './StaffRole';
import { CasePhase } from './CasePhase';
import { CaseHearingDeprecated } from './CaseHearingDeprecated';
import { CaseTask } from './CaseTask';
import { IccsCode } from './IccsCode';
import { CourtLocation } from './CourtLocation';

export class AuthorizedCourt extends LookupEntity {

  courtOID: number = 0;
  locationCode: string = "";
  courtName: string = "";
  casePhases: CasePhase[];
  caseStatuses: CaseStatus[];
  caseTypes: CaseType[];
  casePartyRoles: CasePartyRole[];
  hearingTypes: CaseHearingDeprecated[];
  caseTaskTypes: CaseTask[];
  iccsCodes: IccsCode[];
  eventTypes: CaseEvent[];
  chargeFactors: ChargeFactor[];
  chargeFactorVariables: ChargeFactorVariable[];
  chargeFactorCategory: ChargeFactorCategory[];
  courtLocations: CourtLocation[] = [];
  staffRoles: StaffRole[] = [];
  personIDTypes: Identifier[];
  roles: Role[] = [];
  courtJD: string = "";
}
