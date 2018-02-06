import { LookupEntity } from './base/lookup-entity';
import { Identifier } from './Identifier';
import { ChargeFactor } from './ChargeFactor';
import { CaseEvent } from './CaseEvent';
import { CasePartyRole } from './CasePartyRole';
import { CaseType } from './CaseType';
import { CaseStatus } from './CaseStatus';
import { Role } from './Role';
import { StaffRole } from './StaffRole';
import { CasePhase } from './CasePhase';
import { CaseHearing } from './CaseHearing';
import { CaseTask } from './CaseTask';
import { IccsCode } from './IccsCode';
import { CourtLocation } from './CourtLocation';

export class AuthorizedCourt extends LookupEntity {

  courtOID: number;
  locationCode: string;
  courtName: string;
  casePhases: CasePhase[];
  caseStatuses: CaseStatus[];
  caseTypes: CaseType[];
  casePartyRoles: CasePartyRole[];
  hearingTypes: CaseHearing[];
  caseTaskTypes: CaseTask[];
  iccsCodes: IccsCode[];
  eventTypes: CaseEvent[];
  chargeFactors: ChargeFactor[];
  courtLocations: CourtLocation[];
  staffRoles: StaffRole[] = [];
  personIDTypes: Identifier[];
  roles: Role[];
}
