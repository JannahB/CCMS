import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import "rxjs/add/observable/forkJoin";

import { AuthorizedCourt } from './../../common/entities/AuthorizedCourt';
import { LookupService } from './../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../breadcrumb.service';
import { ToastService } from '../../common/services/utility/toast.service';
import { Court } from '../../common/entities/Court';
import { Role } from './../../common/entities/Role';
import { StaffRole } from '../../common/entities/StaffRole';
import { User } from './../../common/entities/User';
import { AdminUserService } from '../../common/services/http/admin-user.service';
import { PartyService } from './../../common/services/http/party.service';
import { Party } from '../../common/entities/Party';
import { Email } from '../../common/entities/Email';

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
  loadingUser: boolean = false;
  loadingMessage: string = 'Loading user';
  showResetPassword: boolean = false;

  constructor(
    private breadCrumbSvc:BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminUserService,
    private toastSvc: ToastService,
    private partySvc: PartyService
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
    this.partyResults = [];
    this.addAuthCourt();
    this.showResetPassword = false;
  }

  addAuthCourt() {
    let authCourtsLen = this.user.authorizedCourts.push(new AuthorizedCourt());
    this.user.authorizedCourts[authCourtsLen-1].roles.push(new Role());
    this.selectedAuthCourt = this.user.authorizedCourts[authCourtsLen-1];
    // console.log('this.user.authorizedCourts', this.user.authorizedCourts);
  }

  courtOnChange(event, authCourtIdx) {
    // console.log('onChange', event, authCourtIdx);
    // Set the OUTER selected AuthorizedCourt
    this.selectedAuthCourt = this.user.authorizedCourts[authCourtIdx];
    // Set the courtOID on the User object
    this.user.authorizedCourts[authCourtIdx].courtOID = event.value.courtOID;
    this.user.authorizedCourts[authCourtIdx].courtName = event.value.courtName;
    this.user.authorizedCourts[authCourtIdx].locationCode = event.value.locationCode;
  }

  staffRolesOnChange(event, authCourtIdx) {
    // console.log('onFilterStaffRoles', event, authCourtIdx);
    // Set the OUTER selected AuthorizedCourt
    this.selectedAuthCourt = this.user.authorizedCourts[authCourtIdx];
    this.user.authorizedCourts[authCourtIdx].roles = event.value;
  }

  emailChanged(event){
    if(!this.user.emails[0])
      this.user.emails[0] = new Email();

    this.user.emails[0].emailAddress = event;
    this.user.emails[0].emailAddressType = 'Primary';
    this.user.emails[0].startDate = this.user.emails[0].startDate || new Date();
  }

  getStaffRoleNames(acIdx: number) {
    if(acIdx < 0) return;
    let text:string = "";
    let staffRoles:StaffRole[] = this.user.authorizedCourts[acIdx].roles;
    staffRoles.map( staffRole => {
      text += staffRole.staffRoleName +', ';
    })
    let lastCommaIdx = text.lastIndexOf(', ');
    text = text.slice(0, lastCommaIdx);
    return text;
  }

  compareByCourtId(item1, item2) {
    return item1.courtOID == item2.courtOID;
  }

  compareByRoleId(item1, item2) {
    return item1.staffRoleOID == item2.staffRoleOID;
  }

  requestDeleteAuthCourt(authCourtIdx){
    this.user.authorizedCourts.splice(authCourtIdx, 1);
  }

  onShowResetPassword() {
    this.user.password = '';
    this.showResetPassword = true;
  }

  saveUser(addUserForm){
    if(this.validateAuthCourts() && this.passwordsSame()) {
      this.loadingMessage = 'Saving User';
      this.loadingUser = true;

      this.adminSvc
      .saveUser(this.user)
      .subscribe(user => {
        this.loadingUser = false;
        this.user = user[0];
        this.toastSvc.showSuccessMessage('User '+user[0].firstName+' '+user[0].lastName+' saved.', 'User Saved!');
        console.log('user', user);
      },
      (error) => {
        console.error(error);
        this.loadingUser = false;
        this.toastSvc.showErrorMessage('There was an error saving the user.')
      },
      () => {
        this.loadingUser = false;
      });
    }
  }

  private passwordsSame():boolean {
    // Don't validate previously saved user for now.
    if(this.user.partyOID !== 0) return true;
    if (this.user.password != this.password2){
      this.toastSvc.showWarnMessage('Passwords must match.');
      return false;
    }
    return true;
  }

  private validateAuthCourts():boolean {
    let acs:AuthorizedCourt[] = this.user.authorizedCourts;
    let courtOIDs = [];
    let errorFound = false;
    if(!acs || acs.length < 1) {
      this.toastSvc.showWarnMessage('Please add a court and role(s).');
      return false;
    }

    // acs.forEach(ac => {
    acs.some( ac =>  {
      errorFound = false;
      if(!ac.courtOID || !ac.roles.length){
        this.toastSvc.showWarnMessage('One of your Authorized Courts needs a Court and/or Role selection.');
        errorFound = true;
        return false;
      }
      ac.roles.some( sr => {
        if(!sr.staffRoleOID) {
          this.toastSvc.showWarnMessage('One of your Authorized Courts needs a Role selection.');
          errorFound = true;
          return false;
        }
      })

      let idx:number = courtOIDs.findIndex( id => id == ac.courtOID);
      if(idx > -1) {
        this.toastSvc.showWarnMessage('Each Court can only be used once.', 'Duplicate Court');
        errorFound = true;
        return false;
      }
      courtOIDs.push(ac.courtOID);

    });

    if(!errorFound)
      return true;
  }


  // SEARCH USERs -------------------------
  // --------------------------------------

  showRecordsFoundMessage: boolean = false;
  partyNameText: string = '';
  partyResults: Party[];
  recordsFoundMessage: string = '';
  isSearching: boolean = false;

  onSearch():void{
    this.showRecordsFoundMessage = false;
    this.isSearching = true;
    let obj = { "partyName": this.partyNameText, courtUser:"true" };
    this.partySvc
      .fetchAny(obj)
      .subscribe((result) => {
        this.isSearching = false;
        this.partyResults = result;
        this.showNumberOfRecordsFound(result.length);
      },
    (error) => {
      this.isSearching = false;
    },
    () => {
      this.isSearching = false;
    });
  }

  showNumberOfRecordsFound(num){
    let text = num == 1 ? ' record found' : ' records found';
    this.showRecordsFoundMessage = true;
    this.recordsFoundMessage = num + text;
  }

  partyOnRowSelect(event) {
    console.log(event)
    let partyId = event.data.partyOID;
    this.user = event.data;
    this.showResetPassword = false;
  }

  onReset(){
    this.showRecordsFoundMessage = false;
    this.partyNameText = '';
    this.partyResults = [];
    this.showNumberOfRecordsFound(0);
  }



}



