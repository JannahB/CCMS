import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import "rxjs/add/observable/forkJoin";

import { AuthorizedCourt } from './../../common/entities/AuthorizedCourt';
import { LookupService } from './../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../breadcrumb.service';
import { ToastService } from '../../common/services/utility/toast.service';
import { Court } from '../../common/entities/Court';
import { StaffRole } from '../../common/entities/StaffRole';
import { User } from './../../common/entities/User';
import { AdminUserService } from '../../common/services/http/admin-user.service';
import { PartyService } from './../../common/services/http/party.service';
import { Party } from '../../common/entities/Party';

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
  }

  addAuthCourt() {
    let authCourtsLen = this.user.authorizedCourts.push(new AuthorizedCourt());
    this.user.authorizedCourts[authCourtsLen-1].staffRoles.push(new StaffRole());
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
    this.user.authorizedCourts[authCourtIdx].staffRoles = event.value;
  }

  emailChanged(event){
    this.user.emails[0].emailAddress = event.value;
  }

  // getStaffRoleNames(staffRoles:StaffRole[]) {
  //   if(!staffRoles) return;
  //   let text:string = "";
  //   staffRoles.map( staffRole => {
  //     text += staffRole.staffRoleName +', ';
  //   })
  //   let lastCommaIdx = text.lastIndexOf(', ');
  //   text = text.slice(0, lastCommaIdx);
  //   return text;
  // }

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

  requestDeleteAuthCourt(authCourtIdx){
    this.user.authorizedCourts.splice(authCourtIdx, 1);
  }

  saveUser(addUserForm){
    if(this.validateAuthCourts() && this.emailsSame()) {
      this.loadingMessage = 'Saving User';
      this.loadingUser = true;

      this.adminSvc
      .saveUser(this.user)
      .subscribe(user => {
        this.loadingUser = false;
        this.user = user[0];
        this.toastSvc.showSuccessMessage('User '+user.firstName+' '+user.lastName+' saved.', 'User Saved!');
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
  }

  onReset(){
    this.showRecordsFoundMessage = false;
    this.partyNameText = '';
    this.partyResults = [];
    this.showNumberOfRecordsFound(0);
  }



}



