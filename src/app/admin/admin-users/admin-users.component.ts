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
  selectedAuthCourt: AuthorizedCourt;
  password2: string;

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
   -- authorizedCourts
     -- courtOID: number = 0;
     -- locationCode: string = "";
     -- courtName: string = "";
     -- staffRoles: StaffRole[]
         -- staffRoleOID: number;
         -- courtOID: number;
         -- staffRoleName: string;
         -- judicialOfficer: boolean;
         -- ccmsAdmin: boolean;
  */
  addNewUser() {
    this.user = new User();
    this.user.authorizedCourts = [];
    this.addAuthCourt();
  }

  addAuthCourt() {
    let authCourtsLen = this.user.authorizedCourts.push(new AuthorizedCourt());
    this.user.authorizedCourts[authCourtsLen-1].staffRoles.push(new StaffRole());
    this.selectedAuthCourt = this.user.authorizedCourts[authCourtsLen-1];
    console.log('this.user.authorizedCourts', this.user.authorizedCourts);
  }

  courtOnChange(event, authCourtIdx) {
    console.log('onChange', event, authCourtIdx);
    // Set the OUTER selected AuthorizedCourt
    this.selectedAuthCourt = this.user.authorizedCourts[authCourtIdx];
    // Set the courtOID on the User object
    this.user.authorizedCourts[authCourtIdx].courtOID = event.value.courtOID;
    this.user.authorizedCourts[authCourtIdx].courtName = event.value.courtName;
    this.user.authorizedCourts[authCourtIdx].locationCode = event.value.locationCode;

  }

  staffRolesOnChange(event, authCourtIdx) {
    console.log('onFilterStaffRoles', event, authCourtIdx);
    // Set the OUTER selected AuthorizedCourt
    this.selectedAuthCourt = this.user.authorizedCourts[authCourtIdx];
    this.user.authorizedCourts[authCourtIdx].staffRoles = event.value;
  }

  getStaffRoleNames(staffRoles:StaffRole[]) {
    let text:string = "";
    staffRoles.map( staffRole => {
      text += staffRole.staffRoleName +', ';
    })
    let lastCommaIdx = text.lastIndexOf(', ');
    text = text.slice(0, lastCommaIdx);
    return text;
  }

  requestDeleteAuthCourt(authCourtIdx){
    console.log('requestDeleteCourt', authCourtIdx)
    this.user.authorizedCourts.splice(authCourtIdx, 1);
  }

  saveUser(){
    if(this.validateAuthCourts() && this.emailsSame()) {
      console.log('Lets save the user');
    }
  }

  private emailsSame():boolean {
    if (this.user.password != this.password2){
      this.toastSvc.showWarnMessage('Passwords must match.');
      return false;
    }
    return true;
  }

  private validateAuthCourts():boolean {
    let acs:AuthorizedCourt[] = this.user.authorizedCourts;
    let courtOIDs = [];
    if(!acs || acs.length < 1) {
      this.toastSvc.showWarnMessage('Please add a court and role(s).');
      return false;
    }
    acs.forEach(ac => {
      if(!ac.courtOID || !ac.staffRoles.length){
        this.toastSvc.showWarnMessage('One of your Authorized Courts needs a Court and/or Role selection.');
        return false;
      }
      ac.staffRoles.forEach( sr => {
        if(!sr.staffRoleOID) {
          this.toastSvc.showWarnMessage('One of your Authorized Courts needs a Role selection.');
          return false;
        }
      })

      let idx:number = courtOIDs.findIndex( id => id == ac.courtOID);
      if(idx > -1) {
        this.toastSvc.showWarnMessage('Each Court can only be used once.', 'Duplicate Court');
        return false;
      }
      courtOIDs.push(ac.courtOID);

    });

    console.log('We got clean courts!');
    return true;

  }

}



