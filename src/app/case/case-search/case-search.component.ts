import { DropdownDataTransformService } from '../../common/services/utility/dropdown-data-transform.service';
import { SelectItem } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Case } from '../../common/entities/Case';
import { CaseService } from '../../common/services/http/case.service';
import { CaseType } from '../../common/entities/CaseType';
import { CasePhase } from '../../common/entities/CasePhase';
import { CaseStatus } from '../../common/entities/CaseStatus';
import { CasePartyRole } from '../../common/entities/CasePartyRole';
import { LookupService } from '../../common/services/http/lookup.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastService } from '../../common/services/utility/toast.service';

@Component({
  selector: 'app-case-search',
  templateUrl: './case-search.component.html',
  styleUrls: ['./case-search.component.scss']
})
export class CaseSearchComponent implements OnInit {

  caseNumberText: string;
  casePartyNameText: string;
  selectedCaseType: CaseType;
  selectedCasePhaseType: CasePhase;
  selectedCaseStatusType: CaseStatus;
  selectedCasePartyRoleType: CasePartyRole;
  selectedCase: Case;

  caseResults: Case [];
  caseTypes: CaseType[];
  caseTypeOptions: SelectItem[];
  casePhaseTypes: CasePhase[];
  casePhaseTypeOptions: SelectItem[];
  caseStatusTypes: CaseStatus[];
  caseStatusTypeOptions: SelectItem[];
  casePartyRoleTypes: CasePartyRole[];
  casePartyRoleTypeOptions: SelectItem[];

  caseSubsciption: Subscription;
  caseTypesSubscription: Subscription;
  casePhaseTypesSubscription: Subscription;
  caseStatusTypesSubscription: Subscription;
  casePartyRoleTypesSubscription: Subscription;

  isSearcing:boolean = false;

  constructor(
    private caseSvc: CaseService,
    private lookupSvc: LookupService,
    private dropdownSvc: DropdownDataTransformService,
    private toastSvc: ToastService,
    private router:Router
  ) { }

  ngOnInit() {

    this.caseTypesSubscription = this.lookupSvc.fetchLookup<CaseType>('FetchCaseType').subscribe(items => {
      this.caseTypes = items;
    });

    this.caseStatusTypesSubscription = this.lookupSvc.fetchLookup<CaseStatus>('FetchCaseStatus').subscribe(items => {
      this.caseStatusTypes = items;
    });

    this.casePartyRoleTypesSubscription = this.lookupSvc.fetchLookup<CasePartyRole>('FetchCasePartyRole').subscribe(items => {
      this.casePartyRoleTypes = items;
    });

  }

  // This call is chained depency of CaseType Selection and needs caseTypeOID passed in
  onCaseTypeSelect(event) {
    let typeOID = event.value.caseTypeOID.toString(); // TODO: Verify this is event.value
    this.casePhaseTypesSubscription = this.lookupSvc.fetchPhaseByTypeLookup<CasePhase>(typeOID).subscribe(items => {
      this.casePhaseTypes = items;
    });

  }

  casePhaseOnFocus(){
    if(!this.selectedCaseType){
      this.toastSvc.showInfoMessage('Please choose a "Case Type" first');
    }
  }

  casePartyTypeOnChange(event) {
    if(!this.casePartyNameText || !this.casePartyNameText.length){
      this.selectedCasePartyRoleType = null;
      this.toastSvc.showInfoMessage('Please enter "Case Party Name" text before selecting "Case Party Type".', 'Case Party Name Needed');
    }
  }

  onSearch() {
    this.isSearcing = true;
    this.caseResults = null;

    let obj = {};
    if(this.caseNumberText && this.caseNumberText != '') obj = {...obj, caseNumber: this.caseNumberText };
    if(this.casePartyNameText && this.casePartyNameText != '') obj = {...obj, casePartyName: this.casePartyNameText};
    if(this.selectedCaseType) obj = {...obj, caseType: this.selectedCaseType.caseTypeOID.toString() };
    if(this.selectedCasePhaseType) obj = {...obj, casePhase: this.selectedCasePhaseType.casePhaseOID.toString()};
    if(this.selectedCaseStatusType) obj = {...obj, caseStatus: this.selectedCaseStatusType.statusOID.toString()};
    if(this.selectedCasePartyRoleType) obj = {...obj, casePartyRoleOID: this.selectedCasePartyRoleType.casePartyRoleOID.toString()};

    if(Object.keys(obj).length === 0) {
      this.isSearcing = false;
      this.toastSvc.showInfoMessage('Please enter/select criteria and try again.', 'Criteria Needed')
      return;
    }

    this.caseSvc
      .fetchAny(obj)
      .subscribe((result) => {
        this.isSearcing = false;
        if(!result) {
          this.toastSvc.showInfoMessage('Please alter search criteria and try again.', 'No Results');
        }
        this.caseResults = result;
      },
      (error) => {
        console.log(error);
        this.toastSvc.showErrorMessage('There was an error searching cases.');
        this.isSearcing = false;
      },
      () => {
        this.isSearcing = false;
      });

  }

  onReset() {
    this.caseNumberText = null;
    this.casePartyNameText = null;
    this.selectedCaseType = null;
    this.selectedCasePhaseType = null;
    this.selectedCaseStatusType = null;
    this.selectedCasePartyRoleType = null;
  }

  preventNavToCase:boolean = false;

  caseOnRowSelect(event) {
    console.log(event)
    if(this.preventNavToCase) return;

    let caseId = event.data.caseOID;
    this.router.navigate(['/case-detail', caseId ]);
  }


  createAssocatedCase(event, item) {
    this.preventNavToCase = true;
    //event.preventDefault();

    this.caseSvc.createAssociatedCase(item.caseOID).subscribe( (result) => {
      let assocCase:Case = result[0];
      this.toastSvc.showSuccessMessage('Case:'+ assocCase.caseNumber , 'Associated Case Created.');
      this.preventNavToCase = false;
    },
    (error) => {
      console.log(error);
      this.toastSvc.showErrorMessage('There was an error saving the item.');
      this.preventNavToCase = false;
    },
    () => {
      this.preventNavToCase = false;
    })
  }

}
