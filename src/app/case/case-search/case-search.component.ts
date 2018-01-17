import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Case } from './../../common/entities/Case';
import { CaseService } from './../../common/services/http/case.service';
import { CaseType } from './../../common/entities/CaseType';
import { CasePhase } from '../../common/entities/CasePhase';
import { CaseStatus } from '../../common/entities/CaseStatus';
import { CasePartyRole } from '../../common/entities/CasePartyRole';

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

  caseTypes: CaseType[];
  casePhaseTypes: CasePhase[];
  caseStatusTypes: CaseStatus[];
  casePartyRoleTypes: CasePartyRole[];
  caseResults: Case [];

  constructor(
    private caseSvc: CaseService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  onSearch() {
    let obj = {};
    if(this.caseNumberText != '') obj = {...obj, caseNumber: this.caseNumberText };
    if(this.casePartyNameText != '') obj = {...obj, casePartyName: this.casePartyNameText};

    // TODO: These 4 need to be checked for accuracy and activated
    // if(this.selectedCaseType) obj = {...obj, caseNumber: this.caseNumberText };
    // if(this.selectedCasePhaseType) obj = {...obj, casePhase: this.selectedCasePhaseType};
    // if(this.selectedCaseStatusType) obj = {...obj, caseStatus: this.selectedCaseStatusType};
    // if(this.selectedCasePartyRoleType) obj = {...obj, casePartyRoleOID: this.selectedCasePartyRoleType};

    this.caseSvc
      .fetchAny(obj)
      .subscribe((result) => {
        this.caseResults = result;
      });

  }

  partyOnRowSelect(event) {
    console.log(event)
    let partyId = event.data.partyOID;

    this.router.navigate(['/party-detail', partyId ]);

  }

}
