import { AuditEntity } from './audit-entity';
import { ReUrgencyEntity } from './reurgency-entity';

export class LookupEntity extends ReUrgencyEntity implements AuditEntity {
    public endDate: Date;
    public startDate: Date;
    public isDeleted:boolean;
}
