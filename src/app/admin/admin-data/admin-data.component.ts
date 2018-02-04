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
import { AdminService } from '../../common/services/http/admin.service';
import { ToastService } from '../../common/services/utility/toast.service';

@Component({
  selector: 'app-admin-data',
  templateUrl: './admin-data.component.html',
  styleUrls: ['./admin-data.component.scss']
})
export class AdminDataComponent implements OnInit {

  itemsListVisible:boolean = true;

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
    private lookupSvc: LookupService,
    private adminSvc: AdminService,
    private toastSvc: ToastService
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
        this.identifierTypes = results[4] as Identifier[];
        this.iccsCodeTypes = results[5] as IccsCode[];
        this.eventTypes = results[6] as EventType[];
        this.hearingTypes = results[7] as HearingType[];
        this.locationTypes = results[8] as CourtLocation[];
      });


    this.refDataTables = [
      { value: 1, tpl: this.tpl1, label: "Case Type", data: 'caseTypes', idField:'caseTypeOID', dataType: new CaseType(), saveEP:'saveCaseType', fetchEP:'FetchCaseType' },
      { value: 2, tpl: this.tpl2, label: "Case Phase Type", data: 'casePhaseTypes', idField:'casePhaseOID', dataType: new CasePhase(), saveEP:'saveCasePhase', fetchEP:'FetchPhaseByType' },
      { value: 3, tpl: this.tpl1, label: "Case Status Type", data:'caseStatusTypes', idField:'statusOID', dataType: new CaseStatus(), saveEP:'saveCaseStatus', fetchEP:'FetchCaseStatus' },
      { value: 4, tpl: this.tpl3, label: "Case Party Role Type", data:'casePartyRoleTypes', idField:'casePartyRoleOID', dataType: new CasePartyRole(), saveEP:'saveCasePartyRole', fetchEP:'FetchCasePartyRole' },
      { value: 5, tpl: this.tpl1, label: "Party Identifier Type", data:'identifierTypes', idField:'id', dataType: new Identifier(), saveEP:'savePersonalIdentifier', fetchEP:'FetchPersonIdentificationType' },
      { value: 6, tpl: this.tpl4, label: "ICCS Code", data:'iccsCodeTypes', idField:'iccsCodeOID', dataType: new IccsCode(), saveEP:'saveICCSCode', fetchEP:'FetchICCSCodeParent' },
      { value: 7, tpl: this.tpl5, label: "Event Type", data: 'eventTypes', idField:'eventTypeOID', dataType: new EventType(), saveEP:'saveEventType', fetchEP:'FetchEventType' },
      { value: 8, tpl: this.tpl6, label: "Hearing Type", data:'hearingTypes', idField:'hearingTypeOID', dataType: new HearingType(), saveEP:'saveHearingType', fetchEP:'FetchHearingType' },
      { value: 9, tpl: this.tpl1, label: "Court Location", data:'locationTypes', idField:'locationOID', dataType: new CourtLocation(), saveEP:'saveCourtLocationType', fetchEP:'FetchHearingLocation' },
    ];
  }

  refTableSelected(event) {
    this.selectedTableId = event.value;
    this.selectedTable = this.refDataTables.find((type) => type.value ==  event.value);
    this.selectedTableIdField = this.selectedTable['idField'];
    this.selectedTableLabel = this.selectedTable['label'];
    this.selectedTemplate = this.selectedTable['tpl'];
    this.selectedTableItems = this[this.selectedTable.data];

    this.selectedItem = this.selectedTableItems[0];

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

  createNewItem() {
    this.selectedItem = this.selectedTable['dataType'];
  }

  saveDataItem(){

    let ep = this.selectedTable['saveEP'];
    this.adminSvc[ep](this.selectedItem).subscribe( result => {
      console.log('result', result);
      this.refreshList();
      this.toastSvc.showSuccessMessage('Item Saved');
    },
    (error) => {
      console.log(error);
      this.toastSvc.showErrorMessage('There was an error saving the item.');
    },
    () => {
      // final
    })

  }

  refreshList() {
    let fetchEP = this.selectedTable['fetchEP'];
    this.itemsListVisible = false;
    this.lookupSvc.fetchLookup(fetchEP).subscribe(result => {
      this.selectedTableItems = result;
      this.selectedTable['data'] = result;
      this.itemsListVisible = true;
    },
    (error) => {
      console.log(error);
      this.toastSvc.showErrorMessage('There was an error fetching items.');
      this.itemsListVisible = true;
    },
    () => {
      this.itemsListVisible = true;
    })
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
