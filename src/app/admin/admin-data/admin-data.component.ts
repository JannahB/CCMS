import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import "rxjs/add/observable/forkJoin";


import { BreadcrumbService } from '../../breadcrumb.service';
import { IccsCode } from './../../common/entities/IccsCode';
import { CasePartyRole } from './../../common/entities/CasePartyRole';
import { CaseStatus } from './../../common/entities/CaseStatus';
import { HearingType } from './../../common/entities/HearingType';
import { CasePhase } from './../../common/entities/CasePhase';
import { CaseType } from './../../common/entities/CaseType';
import { LookupService } from '../../common/services/http/lookup.service';
import { EventType } from '../../common/entities/EventType';
import { CourtLocation } from '../../common/entities/CourtLocation';

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

  caseTypes: CaseType[];
  casePhaseTypes: CasePhase[];
  caseStatusTypes: CaseStatus[];
  casePartyRoleTypes: CasePartyRole[];
  identifierTypes: any[];
  iccsCodeTypes: IccsCode[];
  eventTypes: EventType[];
  hearingTypes: HearingType[];
  locationTypes: CourtLocation[];

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
      this.lookupSvc.getMock('case-types.json'),
      this.lookupSvc.getMock('case-phase-types.json'),
      this.lookupSvc.getMock('case-status-types.json'),
      this.lookupSvc.getMock('case-party-role-types.json'),
      this.lookupSvc.getMock('identifier-types-temp.json'),
      this.lookupSvc.getMock('iccs-code-types-temp.json'),
      this.lookupSvc.getMock('event-types.json'),
      this.lookupSvc.getMock('hearing-types.json'),
      this.lookupSvc.getMock('location-types.json'),
      // this.lookupSvc.fetchLookup<CaseType>('case-types')
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
        // this.locationTypes = this.dropdownTransformSvc.transform(this.companyOfficeContactTypes, 'contactLastName');

      });


    this.refDataTables = [
      { value: 1, label: "Case Types", data: 'caseTypes', idField:'caseTypeOID' },
      { value: 2, label: "Case Phase Types", data: 'casePhaseTypes', idField:'casePhaseOID'},
      { value: 3, label: "Case Status Types", data:'caseStatusTypes', idField:'statusOID'},
      { value: 4, label: "Case Party Role Types", data:'casePartyRoleTypes', idField:'casePartyRoleOID'},
      { value: 5, label: "Party Identifier Types", data:'identifierTypes', idField:'id'},
      { value: 6, label: "ICCS Codes", data:'iccsCodeTypes', idField:'iccsCodeOID'},
      { value: 7, label: "Event Types", data: 'eventTypes', idField:'eventTypeOID'},
      { value: 8, label: "Hearing Types", data:'hearingTypes', idField:'hearingTypeOID'},
      { value: 9, label: "Court Locations", data:'locationTypes', idField:'locationOID'}

    ];
  }

  refTableSelected(event) {
    this.selectedTableId = event.value;

    this.selectedTable = this.refDataTables.find((type) => type.value ==  event.value);
    this.selectedTableIdField = this[this.selectedTable.idField];
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


}
