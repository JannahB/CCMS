import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import "rxjs/add/observable/forkJoin";

import { AuthorizedCourt } from '../../common/entities/AuthorizedCourt';
import { LookupService } from '../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../breadcrumb.service';
import { ToastService } from '../../common/services/utility/toast.service';
import { AdminUserService } from '../../common/services/http/admin-user.service';
import { PartyService } from '../../common/services/http/party.service';

import { Court } from '../../common/entities/Court';
import { Role } from '../../common/entities/Role';
import { StaffRole } from '../../common/entities/StaffRole';
import { User } from '../../common/entities/User';

import { Party } from '../../common/entities/Party';
import { Email } from '../../common/entities/Email';
import { Pool } from '../../common/entities/Pool';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-staffpools',
  templateUrl: './admin-staffpools.component.html',
  styleUrls: ['./admin-staffpools.component.scss']
})

export class AdminStaffPoolComponent implements OnInit {

  courts: Court[];
  staffRoles: StaffRole[];
  staffPool: Pool[];
  selectedPoolLocation: number;
  staffPoolParties: Party[];
  staffParties: Party[];
  lookupSubscription: Subscription;
  user: User;
  selectedStaffRoles: StaffRole[];
  selectedStaffPool: Pool;
  selectedAuthCourt: AuthorizedCourt;
  selectedStaffParty: Party;
  password2: string;
  loadingUser: boolean = false;
  loadingMessage: string = 'Loading user';
  showResetPassword: boolean = false;
  showLoadingBar: boolean = false;
  loadingUpdateStatus: boolean = false;


  constructor(
    private breadCrumbSvc: BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminUserService,
    private toastSvc: ToastService,
    private partySvc: PartyService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Staff Pool Management', routerLink: ['/admin/staffpools'] }
    ]);
  }

  ngOnInit() {
    this.getRefData();
       
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
      this.lookupSvc.fetchLookup<Pool>('FetchStaffPool'),
      
    );

    this.lookupSubscription = source.subscribe(
      results => {
        this.courts = results[0] as Court[];
        this.staffRoles = results[1] as StaffRole[];
        this.staffPool = results[2] as Pool[];
        this.poolResults = results[2] as Pool[];
        console.log('Staff Pool retrieved from Server is: ', this.staffPool);
      });


      let partyObservable: Observable<Party[]> = this.partySvc
      .getAllSlim();
  
      Observable.forkJoin(
      partyObservable
      ).subscribe(
      results => {
        this.staffParties = results[0];
        this.showLoadingBar = false;
      },
      error => {
        this.showLoadingBar = false;
        this.toastSvc
          .showErrorMessage("Unable to Locate Court Staff Users");
      }
      );

  }
 
  addStaffPoolMember() {
    this.staffPoolParties.push(new Party()); 
  }


  staffPoolMemberOnChange(event, acIdx) {
  
    let staffPoolPartyLen = this.staffPoolParties.length;
    this.staffPoolParties[acIdx].partyOID = event.value.id;
    this.staffPoolParties[acIdx].firstName = event.value.firstName;
    this.staffPoolParties[acIdx].lastName = event.value.lastName;  
  }

  //This compares the values between two arrays
  //This case all staff parties and staffPoolMembers
  compareByPartyID(item1, item2) {
    return item1.id == item2.partyOID;
  }

  requestDeleteStaffPoolMember(authCourtIdx) {
    this.staffPoolParties.splice(authCourtIdx, 1);
  }

  
  SaveStaffPool(addStaffPartyForm) {
    
      let i = 0;
      for( i = 0; i < this.poolResults.length; i++){
        if (this.selectedPool.poolOID == this.poolResults[i].poolOID) break;
      }
    
      //Set the selected pool parties to the current list if staff members entered
      //from the UI
      this.poolResults[i].poolStaffParties = this.staffPoolParties;

      this.partySvc.SaveStaffPool(this.poolResults[i])
      .subscribe(c => {
        this.loadingUpdateStatus = false;
        this.selectedPool = c;
      },
        (error) => {
          console.log(error);
          this.loadingUpdateStatus = false;
          this.toastSvc.showErrorMessage('There was an error saving the staff pool. Please ensure you are not entering duplicate staff parties')
        },
        () => {
          this.loadingUpdateStatus = false;
          this.toastSvc.showSuccessMessage('Staff Pool Updated Successfully')
        });

      let obj = { "poolName": this.poolNameText, courtUser: "true" };
      this.partySvc
      .fetchSpecificStaffPools(obj)
      .subscribe((result) => {
        this.isSearching = false;
        this.poolResults = result;
        this.staffPool = result;
        this.showNumberOfRecordsFound(result.length);
      },
        (error) => {
          this.isSearching = false;
        },
        () => {
          this.isSearching = false;
        });
  }

    
  // SEARCH STAFF POOLS -------------------
  // --------------------------------------

  showRecordsFoundMessage: boolean = false;
  poolNameText: string = '';
  poolResults: Pool[];
  recordsFoundMessage: string = '';
  isSearching: boolean = false;
  selectedPool: Pool;

  onSearch(): void {

    this.showRecordsFoundMessage = false;
    this.isSearching = true;
    let obj = { "poolName": this.poolNameText, courtUser: "true" };
    
    this.partySvc
      .fetchSpecificStaffPools(obj)
      .subscribe((result) => {
        this.isSearching = false;
        this.poolResults = result;
        this.staffPool = result;
        this.showNumberOfRecordsFound(result.length);
      },
        (error) => {
          this.isSearching = false;
        },
        () => {
          this.isSearching = false;
        });
  }

  showNumberOfRecordsFound(num) {
    let text = num == 1 ? ' record found' : ' records found';
    this.showRecordsFoundMessage = true;
    this.recordsFoundMessage = num + text;
  }

  partyOnRowSelect(event) {  
    let partyId = event.data.partyOID;
    this.user = event.data;
    this.showResetPassword = false;
  }

  onReset() {
    this.showRecordsFoundMessage = false;
    this.poolNameText = '';
    this.poolResults = [];
    this.staffPoolParties = [];
    this.showNumberOfRecordsFound(0);
  }

  staffPoolOnRowSelect(event){

    let obj = { "poolName": this.poolNameText, courtUser: "true" };
    this.partySvc
      .fetchSpecificStaffPools(obj)
      .subscribe((result) => {
        this.isSearching = false;
        this.poolResults = result;
        this.staffPool = result;
        this.showNumberOfRecordsFound(result.length);
      },
        (error) => {
          this.isSearching = false;
        },
        () => {
          this.isSearching = false;
        });
   
    if(this.poolResults.length == 1)
      this.selectedPool.poolStaffParties = this.poolResults[0].poolStaffParties;
    
    else{
      //We need to find the location for the matching pool ids
      let i = 0;
      for( i = 0; i < this.poolResults.length; i++){
        if (this.selectedPool.poolOID == this.poolResults[i].poolOID) break;
      }
      this.selectedPool.poolStaffParties = this.poolResults[i].poolStaffParties;
    }

    this.staffPoolParties = this.selectedPool.poolStaffParties; 
  }
  
}



