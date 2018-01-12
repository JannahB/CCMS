import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { BreadcrumbService } from '../../breadcrumb.service';
import { CaseHearing } from './../../common/entities/CaseHearing';
import { CaseEvent } from './../../common/entities/CaseEvent';
import { CaseDocument } from './../../common/entities/CaseDocument';
import { Case } from './../../common/entities/Case';
import { CaseCharge } from './../../common/entities/CaseCharge';
import { CaseService } from './../../common/services/http/case.service';
import { CaseTask } from '../../common/entities/CaseTask';
import { DocTemplate } from '../../common/entities/DocTemplate';
import { Party } from './../../common/entities/Party';


@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html',
  styleUrls: ['./case-detail.component.scss']
})
export class CaseDetailComponent implements OnInit, OnDestroy {

  case: Case;
  caseSubscription: Subscription;
  caseWeightRanges: number[] = [1,10];

  selectedCharge: CaseCharge;
  selectedParty: Party;
  selectedTask: CaseTask;
  selectedDoc: CaseDocument;
  selectedEvent: CaseEvent;
  selectedHearing: CaseHearing;
  selectedJudicialAssignment: any;
  documentTemplateTypes: DocTemplate[] = [];


  constructor(
    private activatedRoute:ActivatedRoute,
    private breadCrumbSvc: BreadcrumbService,
    private caseSvc: CaseService
  ) { 
    this.breadCrumbSvc.setItems([
      { label: 'Case', routerLink: ['/case-detail'] }
    ]);
  }

  ngOnInit() {
    
    let params:any = this.activatedRoute.params;
    let caseId:string = params.value.caseId;
    if(parseInt(caseId) == 0) {
      this.case = new Case();
    }

    // FETCH CASE Call when API calls are ready
    // this.caseSubscription = this.partySvc.fetch(partyId).subscribe (parties => {
    //   this.party = parties[0];
    // })

    this.caseSubscription = this.caseSvc.getOneMock(caseId).subscribe (kase => {
      this.case = kase;
    })
  }

  ngOnDestroy() {
    
    if (this.caseSubscription) this.caseSubscription.unsubscribe();
    
  }


  partyOnRowSelect(event) {

  }

  caseOnRowSelect(event) {

  }

  chargeOnRowSelect(event){

  }
  eventOnRowSelect(event) {

  }
  taskOnRowSelect(event){

  }
  docOnRowSelect(event){

  }
  hearingOnRowSelect(event){

  }
  judicialAssignmentOnRowSelect(event) {

  }

}
