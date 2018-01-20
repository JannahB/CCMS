import { SelectItem } from 'primeng/primeng';
import { Pool } from './../../common/entities/Pool';
import { EventType } from './../../common/entities/EventType';
import { CasePartyRole } from './../../common/entities/CasePartyRole';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

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
import { TaskType } from '../../common/entities/TaskType';
import { IccsCode } from '../../common/entities/IccsCode';
import { ChargeFactor } from '../../common/entities/ChargeFactor';
import { ToastService } from '../../common/services/utility/toast.service';
import { CollectionUtil } from '../../common/utils/collection-util';
import { PartyService } from '../../common/services/http/party.service';
import { CaseParty } from '../../common/entities/CaseParty';
import { LookupService } from '../../common/services/http/lookup.service';
import { CaseTaskDTO } from '../../common/entities/CaseTaskDTO';


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
  selectedDoc: CaseDocument;
  selectedEvent: CaseEvent;
  selectedHearing: CaseHearing;
  selectedJudicialAssignment: any;
  documentTemplateTypes: DocTemplate[] = [];
  selectedDocumentTemplateType: DocTemplate;

  datePipe:DatePipe = new DatePipe("en");

  constructor(
    private activatedRoute:ActivatedRoute,
    private breadCrumbSvc: BreadcrumbService,
    private caseSvc: CaseService,
    private partySvc: PartyService,
    private router:Router,
    private toastSvc:ToastService,
    private lookupSvc: LookupService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Case', routerLink: ['/case-detail'] }
    ]);
  }

  ngOnInit() {

    let params:any = this.activatedRoute.params;
    let caseId:string = params.value.caseId;
    if(parseInt(caseId) == 0) {
      // TODO: Create New Case with empty properties;
      // new'ing doesn't bring properties w/o constructor on entity!?
      this.case = new Case();

      // this is temp until empty new Case()

    }

    this.caseSubscription = this.caseSvc.fetchOne(caseId).subscribe (kase => {
      this.case = kase;
    });

    this.caseSvc
      .fetchDocumentTemplate()
      .subscribe(results => this.documentTemplateTypes = results);
  }

  ngOnDestroy() {

    if (this.caseSubscription) this.caseSubscription.unsubscribe();

  }

  addNewParty() {
    this.router.navigate(['/party-detail', 0 ]);
  }

  partyOnRowSelect(event) {

  }

  caseOnRowSelect(event) {

  }

  chargeOnRowSelect(event){

  }
  eventOnRowSelect(event) {

  }

  docOnRowSelect(event){

  }
  hearingOnRowSelect(event){

  }
  judicialAssignmentOnRowSelect(event) {

  }



  // MODALS --------------------------------------------

  hideModals(){
    this.showModalAddCaseCharge = false;
    this.showModalAddCaseParty = false;
    this.showModalAddCaseTask = false;
    this.showModalAddJudge = false;
    this.showModalAddEvent = false;
    this.showDeleteChargeModal = false;
    this.showDeletePartyModal = false;
  }

  // -------------------------
  //   ADD CASE PARTY MODAL
  // ------------------------=

  showModalAddCaseParty: boolean = false;
  showDeletePartyModal: boolean = false;
  partySearchText: string;
  searchPartyResults: Party[];
  casePartyRoleTypes: CasePartyRole[];
  selectedSearchParty: Party;
  selectedSearchPartyRole: CasePartyRole = null;
  selectedSearchPartyStartDate:Date = null;
  selectedSearchPartyEndDate:Date = null;
  selectedCaseParty:CaseParty = null;

  showAddCaseParty(){
    this.showModalAddCaseParty = true;
    this.caseSvc
      .fetchCasePartyRole()
      .subscribe( roles => this.casePartyRoleTypes = roles );
  }

  searchForParty(){
    let obj = { "partyName": this.partySearchText };
    this.partySvc
      .fetchAny(obj)
      .subscribe( results => {
        this.searchPartyResults = results;

        if(results.length){
          this.selectedSearchParty = results[0];
        }
      });

  }

  searchPartyOnRowSelect(event){
    this.selectedSearchParty = event.data;

    this.selectedSearchPartyRole = null;
    this.selectedSearchPartyStartDate = null;
    this.selectedSearchPartyEndDate = null;
  }

  searchPartyRoleTypeOnChange() {

  }

  addPartyToCase() {
    let caseParty:CaseParty = new CaseParty();

    caseParty.caseParty = this.selectedSearchParty;
    caseParty.role = this.selectedSearchPartyRole;
    caseParty.startDate = this.selectedSearchPartyStartDate ? this.datePipe.transform(this.selectedSearchPartyStartDate, "MM/dd/yyyy") : "";
    caseParty.endDate = this.selectedSearchPartyEndDate ? this.datePipe.transform(this.selectedSearchPartyEndDate, "MM/dd/yyyy") : "";

    let caseParties:CaseParty[] = this.case.caseParties.slice();
    caseParties.push(caseParty);
    this.case.caseParties = caseParties;

    this.saveCase();

    this.hideModals();
  }

  calculateAge(dob) {
    if(!dob) return;
    return moment().diff(dob, 'years');
  }

  requestDeleteParty(party:CaseParty):void{
    this.selectedCaseParty = party;
    this.showDeletePartyModal = true;
  }

  deleteParty():void{
    CollectionUtil.removeArrayItem(this.case.caseParties, this.selectedCaseParty);
    this.case.caseParties = this.case.caseParties.slice();
    this.showDeletePartyModal = false;
    this.saveCase(false);
  }

  // -------------------------
  //   ADD CASE CHARGE MODAL
  // ------------------------=

  showModalAddCaseCharge: boolean = false;
  showDeleteChargeModal:boolean = false;

  sectionTypes: IccsCode[];        // FetchICCSCategory GET
  selectedSectionType: IccsCode;
  divisionTypes: IccsCode[];
  selectedDivisionType: IccsCode;
  groupTypes: IccsCode[];
  selectedGroupType: IccsCode;
  classTypes: IccsCode[];
  selectedClassType: IccsCode;
  chargeLawTypes: any[];
  selectedChargeLawType: any;
  leaLeadChargeText:string;
  chargeFactorTypes: ChargeFactor[];        // FetchChargeFactor GET
  selectedChargeFactors: ChargeFactor[];
  filteredChargeFactorTypes: ChargeFactor[];
  lastSelectedTypeLocalCharges: any[] = [];

  onShowAddCaseChargeModal() {
    this.showModalAddCaseCharge = true;

    this.caseSvc
      .fetchICCSCategory()
      .subscribe(categories => {
        this.sectionTypes = categories;
      })

    this.caseSvc
      .fetchChargeFactor()
      .subscribe(chargeFactors =>{
        this.chargeFactorTypes = chargeFactors;
        this.filteredChargeFactorTypes = chargeFactors;
      })
  }

  sectionTypeOnChange(event){
    this.caseSvc
      .fetchICCSCategory(this.selectedSectionType.iccsCodeOID)
      .subscribe(categories => {
        this.divisionTypes = categories;
      });
  }

  divisionTypeOnChange(event){
    this.chargeLawTypes = this.selectedDivisionType.localCharges;
    this.caseSvc
      .fetchICCSCategory(this.selectedDivisionType.iccsCodeOID)
      .subscribe(categories => {
        this.groupTypes = categories;
      });
  }

  groupTypeOnChange(event){
    this.chargeLawTypes = this.selectedGroupType.localCharges;
    this.caseSvc
      .fetchICCSCategory(this.selectedGroupType.iccsCodeOID)
      .subscribe(categories => {
        this.classTypes = categories;
      });
  }

  classTypeOnChange(event){
    this.chargeLawTypes = this.selectedClassType.localCharges;
  }

  chargeLawTypeOnChange(event){
    // may not need to handle this one, use [(ngModel)]
  }

  getChargeFactorsToFilter(event) {
    let query = event.query;
    this.filteredChargeFactorTypes = this.filterChargeFactors(query, this.chargeFactorTypes);
  }

  filterChargeFactors( query, chargeFactorTypes: any[] ):any[] {
    let filtered : any[] = [];
    for(let i = 0; i < chargeFactorTypes.length; i++) {
      let cf = chargeFactorTypes[i];
      if(cf.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(cf);
      }
    }
    return filtered;
  }

  saveCaseCharge(){
    let charge:CaseCharge;

    if(this.selectedCharge){
      charge = this.selectedCharge;
    }else{
      charge = new CaseCharge();
    }

    let iccsCode:IccsCode = this.getIccsCode();

    charge.caseOID = this.case.caseOID;
    charge.courtOID = this.case.court.courtOID;
    charge.chargeFactors = this.selectedChargeFactors;
    charge.iccsCode = iccsCode;

    if(iccsCode){
      charge.iccsChargeCategoryOID = iccsCode.iccsCodeOID;
    }

    charge.leaChargingDetails = this.leaLeadChargeText;
    charge.localCharge = this.selectedChargeLawType;

    if(!charge.caseChargeOID){
      this.case.caseCharges.push(charge);
    }

    this.case.caseCharges = this.case.caseCharges.slice();

    this.hideModals();
  }

  private getIccsCode():IccsCode{
    if(this.selectedClassType){
      return this.selectedClassType;
    }

    if(this.selectedGroupType){
      return this.selectedGroupType;
    }

    if(this.selectedDivisionType){
      return this.selectedDivisionType;
    }

    if(this.selectedSectionType){
      return this.selectedSectionType;
    }

    return null;
  }

  requestDeleteCharge(charge:CaseCharge):void{
    this.selectedCharge = charge;
    this.showDeleteChargeModal = true;
  }

  deleteCharge():void{
    CollectionUtil.removeArrayItem(this.case.caseCharges, this.selectedCharge);
    this.case.caseCharges = this.case.caseCharges.slice();
    this.showDeleteChargeModal = false;
    this.saveCase(false);
  }

  // -------------------------
  //   ADD CASE TASK MODAL
  // ------------------------=

  selectedCaseTask: CaseTask;
  showModalAddCaseTask: boolean = false;
  task: any = {};
  taskTypes: TaskType[];
  priorityTypes: SelectItem[] = [
    { value: 0, label: 'N/A'},
    { value: 1, label: 'Urgent' },
    { value: 2, label: 'High' },
    { value: 3, label: 'Normal' }
  ];
  taskParties: Party[];
  staffPools: Pool[];

  onShowCaseTaskModal(){
    this.showModalAddCaseTask = true;
    // TODO: get lookup data
  }

  taskOnRowSelect(event){
    this.fetchCaseTaskLookups();
    this.selectedCaseTask = event.data;
    this.onShowCaseTaskModal();
    console.log('taskOnRowSelect selected case task', this.selectedCaseTask)
  }

  beginAddCaseTask( taskTypeId? ) {
    this.fetchCaseTaskLookups();
    this.selectedCaseTask = new CaseTask();
    this.onShowCaseTaskModal();
    if(taskTypeId){
      this.selectedCaseTask.taskType = this.taskTypes.find((task) => task.taskTypeOID == taskTypeId );
    }
  }

  fetchCaseTaskLookups() {
    this.partySvc.fetchAny({courtUser: "true"}).subscribe( results => {
      this.taskParties = results;
    });
    this.lookupSvc.fetchLookup<TaskType>('FetchTaskType').subscribe( results => {
      this.taskTypes = results;
    })
    this.lookupSvc.fetchLookup<Pool>('FetchStaffPool').subscribe( results => {
      this.staffPools = results;
    })
  }

  taskTypeOnChange(event) {
    // TODO: handle change, may not be needed if binding to ngModel
  }

  priorityTypeOnChange(event){
    this.selectedCaseTask.taskPriorityCode = event.value;
  }

  assignedPersonTypeOnChange(event) {
    // TODO: handle change, may not be needed if binding to ngModel
  }

  staffPoolTypeOnChange(event) {
    // TODO: handle change, may not be needed if binding to ngModel
  }

  onCancelCaseTask(form) {
    this.selectedCaseTask = null;
    form.reset();
    this.hideModals();
  }

  saveCaseTask() {
    let task = new CaseTaskDTO();
    task.caseOID = this.case.caseOID.toString();
    task.taskDetails = this.selectedCaseTask.details;
    task.taskParty = this.selectedCaseTask.assignedParty.partyOID.toString();
    task.taskPriorityCode = this.selectedCaseTask.taskPriorityCode.toString();
    task.taskStaffPool = this.selectedCaseTask.assignedPool.poolOID.toString();
    task.taskType = this.selectedCaseTask.taskType.taskTypeOID.toString();
    task.taskDueDate = this.datePipe.transform(this.selectedCaseTask.dueDate, "yyyy-MM-dd"); // taskDueDate:"2018-01-31"

    this.caseSvc.saveCaseTask(task).subscribe( result => {
      this.case.caseTasks.push(result);
      this.toastSvc.showSuccessMessage('Your case task has been saved.', 'Task Saved');
      this.hideModals();
      this.selectedCaseTask = null;
    });
  }




  // -------------------------
  //   ADD JUDGE MODAL
  // ------------------------=

  showModalAddJudge: boolean = false;
  judges: any[];
  judge: any = {};


  onShowJudgeModal(){
    this.showModalAddJudge = true;
    // TODO: get lookup data
  }

  saveJudge(){
    // TODO: handle save
  }


  // -------------------------
  //   ADD COMPLETED EVENT MODAL
  //   (in Register tab)
  // ------------------------=

  showModalAddEvent: boolean = false;
  events: any[];
  event: any = {};
  eventTypes: EventType[]; // verify correct data type
  eventParties: Party[];   // verify correct data type
  documents: any[];


  onShowEventModal(){
    this.showModalAddEvent = true;
    // TODO: get lookup data
  }

  saveEvent(){
    // TODO: handle save
  }

  saveCase(shouldShowSuccessMessage:boolean = true){
    this.caseSvc
      .saveCourtCase(this.case)
      .subscribe(c => {
        this.case = c;
        if(shouldShowSuccessMessage){
          this.toastSvc.showSuccessMessage("Case Saved");
        }
      });
  }

  generateDoc():void{
    this.caseSvc
      .downloadCourtDocument(this.case.caseOID, this.selectedDocumentTemplateType.documentTemplateOID)
      .subscribe();
  }




  // -------------------------
  //   HEARING MODAL
  // ------------------------=

  addHearingTask(){
    this.hideModals();
    this.onShowCaseTaskModal()


  }


}
