import { Component, OnInit } from '@angular/core';

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

  caseTypes: CaseType[];
  casePhaseTypes: CasePhase[];
  caseStatusTypes: CaseStatus[];
  casePartyRoleTypes: CasePartyRole[];
  
  selectedCaseType: CaseType;
  selectedCasePhaseType: CasePhase;
  selectedCaseStatusType: CaseStatus;
  selectedCasePartyRoleType: CasePartyRole;
  
  constructor() { }

  ngOnInit() {
  }

}
