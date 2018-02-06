import { AuthorizedCourt } from './../../common/entities/AuthorizedCourt';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import "rxjs/add/observable/forkJoin";

import { AdminDataService } from '../../common/services/http/admin-data.service';
import { LookupService } from './../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../breadcrumb.service';
import { ToastService } from '../../common/services/utility/toast.service';
import { Court } from '../../common/entities/Court';
import { StaffRole } from '../../common/entities/StaffRole';
import { User } from './../../common/entities/User';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  courts: Court[];
  staffRoles: StaffRole[];
  lookupSubscription: Subscription;
  user: User;
  selectedStaffRoles: StaffRole[];
  selectedCourt: AuthorizedCourt;

  constructor(
    private breadCrumbSvc:BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Admin User Management', routerLink: ['/admin-users'] }
    ]);
  }

  ngOnInit() {
    this.getRefData();
    this.addNewUser();
  }

  ngOnDestroy() {
    if (this.lookupSubscription) {
        this.lookupSubscription.unsubscribe();
    }
  }

  getRefData() {

    var source = Observable.forkJoin<any>(
      this.lookupSvc.fetchLookup<Court>('FetchCourt'),
      this.lookupSvc.fetchLookup<StaffRole>('FetchStaffRole'),
    );

    this.lookupSubscription = source.subscribe(
      results => {
        this.courts = results[0] as Court[];
        this.staffRoles = results[1] as StaffRole[];
    });

  }

  /* User
   -- roles: StaffRole[]
   StaffRole
   -- staffRoleOID: number;
   -- courtOID: number;
   -- staffRoleName: string;
   -- judicialOfficer: boolean;
   -- ccmsAdmin: boolean;
  */
  addNewUser() {
    this.user = new User();
    this.user.authorizedCourts = [];
    this.addUserCourt();
  }

  addUserCourt() {
    let courtLen = this.user.authorizedCourts.push(new AuthorizedCourt());
    this.user.authorizedCourts[courtLen-1].staffRoles.push(new StaffRole());
  }

  courtOnChange(event) {
    console.log('onChange', event);
  }

  onFilterStaffRoles(event) {
    console.log('onFilterStaffRoles', event);
  }

  requestDeleteCourt(idx){
    console.log('requestDeleteCourt', idx)
    this.user.authorizedCourts.splice(idx, 1);
  }

}



