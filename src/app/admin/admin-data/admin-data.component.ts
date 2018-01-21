import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import "rxjs/add/observable/forkJoin";


import { BreadcrumbService } from '../../breadcrumb.service';
import { IccsCode } from './../../common/entities/IccsCode';
import { Identifier } from './../../common/entities/Identifier';
import { CasePartyRole } from './../../common/entities/CasePartyRole';
import { CaseStatus } from './../../common/entities/CaseStatus';
import { HearingType } from './../../common/entities/HearingType';
import { CasePhase } from './../../common/entities/CasePhase';
import { CaseType } from './../../common/entities/CaseType';
import { LookupService } from '../../common/services/http/lookup.service';
import { EventType } from '../../common/entities/EventType';
import { CourtLocation } from '../../common/entities/CourtLocation';
import { CaseEvent } from '../../common/entities/CaseEvent';

@Component({
  selector: 'app-admin-data',
  templateUrl: './admin-data.component.html',
  styleUrls: ['./admin-data.component.scss']
})
export class AdminDataComponent implements OnInit {

  iSaySo:boolean = true;

  refDataTables: any[];
  selectedTable: any;
  selectedTableId: number;
  selectedTableIdField: string;
  selectedTableItems: any[];
  selectedItem: any;
  selectedItemCopy: any;
  selectedTableLabel: string;

  caseTypes: CaseType[];
  casePhaseTypes: CasePhase[];
  caseStatusTypes: CaseStatus[];
  casePartyRoleTypes: CasePartyRole[];
  identifierTypes: any[];
  iccsCodeTypes: IccsCode[];
  eventTypes: EventType[];
  hearingTypes: HearingType[];
  locationTypes: CourtLocation[];

  selectedTemplate: TemplateRef<any>;

  @ViewChild('tpl1') tpl1: TemplateRef<any>;
  @ViewChild('tpl2') tpl2: TemplateRef<any>;
  @ViewChild('tpl3') tpl3: TemplateRef<any>;
  @ViewChild('tpl4') tpl4: TemplateRef<any>;
  @ViewChild('tpl5') tpl5: TemplateRef<any>;
  @ViewChild('tpl6') tpl6: TemplateRef<any>;
  // @ViewChild('tpl7') tpl7: TemplateRef<any>;
  // @ViewChild('tpl8') tpl8: TemplateRef<any>;
  // @ViewChild('tpl9') tpl9: TemplateRef<any>;

  constructor(
    private breadCrumbSvc:BreadcrumbService,
    private lookupSvc: LookupService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Admin Table Maintenance', routerLink: ['/admin-data'] }
    ]);
  }

  ngOnInit() {
    this.getRefData();
  }

  getRefData() {

    var source = Observable.forkJoin<any>(

      this.lookupSvc.fetchLookup<CaseType>('FetchCaseType'),
      this.lookupSvc.getMock('case-phase-types.json'),
      // this.lookupSvc.fetchLookup<CaseType>('FetchCasePhase'), // not available
      this.lookupSvc.fetchLookup<CaseStatus>('FetchCaseStatus'),
      this.lookupSvc.fetchLookup<CasePartyRole>('FetchCasePartyRole'),
      this.lookupSvc.fetchLookup<any>('FetchPersonIdentificationType'),
      this.lookupSvc.getMock('iccs-code-types-temp.json'),
      // this.lookupSvc.fetchLookup<CaseType>('ICCSCodes'), // not available
      this.lookupSvc.fetchLookup<CaseEvent>('FetchEventType'),
      this.lookupSvc.fetchLookup<HearingType>('FetchHearingType'),
      this.lookupSvc.fetchLookup<CourtLocation>('FetchHearingLocation'),
    );

    var subscription = source.subscribe(
      results => {
        this.caseTypes = results[0] as CaseType[];
        this.casePhaseTypes = results[1] as CasePhase[];
        this.caseStatusTypes = results[2] as CaseStatus[];
        this.casePartyRoleTypes = results[3] as CasePartyRole[];
        this.identifierTypes = results[4] as any[];
        this.iccsCodeTypes = results[5] as IccsCode[];
        this.eventTypes = results[6] as EventType[];
        this.hearingTypes = results[7] as HearingType[];
        this.locationTypes = results[8] as CourtLocation[];
      });


    this.refDataTables = [
      { value: 1, label: "Case Type", data: 'caseTypes', idField:'caseTypeOID', tpl: this.tpl1 },
      { value: 2, label: "Case Phase Type", data: 'casePhaseTypes', idField:'casePhaseOID', tpl: this.tpl2 },
      { value: 3, label: "Case Status Type", data:'caseStatusTypes', idField:'statusOID', tpl: this.tpl1 },
      { value: 4, label: "Case Party Role Type", data:'casePartyRoleTypes', idField:'casePartyRoleOID', tpl: this.tpl3 },
      { value: 5, label: "Party Identifier Type", data:'identifierTypes', idField:'id', tpl: this.tpl1 },
      { value: 6, label: "ICCS Code", data:'iccsCodeTypes', idField:'iccsCodeOID', tpl: this.tpl4 },
      { value: 7, label: "Event Type", data: 'eventTypes', idField:'eventTypeOID', tpl: this.tpl5 },
      { value: 8, label: "Hearing Type", data:'hearingTypes', idField:'hearingTypeOID', tpl: this.tpl6 },
      { value: 9, label: "Court Location", data:'locationTypes', idField:'locationOID', tpl: this.tpl1 }

    ];
  }

  refTableSelected(event) {
    this.selectedTableId = event.value;
    this.selectedTable = this.refDataTables.find((type) => type.value ==  event.value);
    this.selectedTableIdField = this.selectedTable['idField'];
    this.selectedTableItems = this[this.selectedTable.data];
    this.selectedItem = this.selectedTableItems[0];
    this.selectedTableLabel = this.selectedTable['label'];
    this.selectedTemplate = this.selectedTable['tpl'];

    console.log('selectedTable', this.selectedTable);
    console.log('selectedTableItems', this.selectedTableItems);
  }

  selectedItemChanged(event) {
    this.selectedItem = event.value;
    this.selectedItemCopy = { ...this.selectedItem };
    console.log('selecteRefDataItem', this.selectedItem);
  }

  resetAllForms(){

  }

  cancelDataItemEdit(){

  }

  deleteDataItemRequest(){

  }

  saveDataItem(){

  }



  // -------------------
  // Case Phase Methods
  // -------------------
  saveParentCaseType(){

  }

  parentCaseTypeOnChange(){

  }



  // ---------------------
  // ICCS Codes Methods
  // ---------------------
  parentIccsCodes: IccsCode[];

  saveIccsCode(){

  }

  onCategoryTypeChanged(event){
    this.lookupSvc.fetchLookup<IccsCode>('FetchICCSCodeParent').subscribe( results => {
      this.parentIccsCodes = results;
    })
  }



}
