import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { SelectItem } from 'primeng/primeng';

import { Pool } from './../../common/entities/Pool';
import { EventType } from './../../common/entities/EventType';
import { CasePartyRole } from './../../common/entities/CasePartyRole';
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
import { JudicialAssignment } from '../../common/entities/JudicialAssignment';
import { JudicialOfficer } from '../../common/entities/JudicialOfficer';
import { CaseType } from '../../common/entities/CaseType';
import { CaseStatus } from '../../common/entities/CaseStatus';
import { CasePhase } from '../../common/entities/CasePhase';
import { environment } from '../../../environments/environment';
import { DropdownPipe } from './../../common/pipes/dropdown.pipe';


@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html',
  styleUrls: ['./case-detail.component.scss']
})
export class CaseDetailComponent implements OnInit, OnDestroy {

  activeTabIndex: number = 1;
  case: Case;
  caseSubscription: Subscription;
  caseTaskSubscription: Subscription;
  caseWeightRanges: number[] = [1,10];
  loadingCase: boolean = false;
  loadingMessage: string = 'loading case...';
  selectedCharge: CaseCharge;
  selectedParty: Party;
  selectedDoc: CaseDocument;
  selectedEvent: CaseEvent;
  selectedHearing: CaseHearing;
  selectedJudicialAssignment: any;
  documentTemplateTypes: DocTemplate[] = [];
  selectedDocumentTemplateType: DocTemplate;
  routeSubscription: Subscription;
  caseTypes:CaseType[] = [];
  caseStatuses:CaseStatus[] = [];
  casePhases:CasePhase[] = [];
  baseURL: string;

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

    this.baseURL = environment.apiUrl;

    this.routeSubscription = this.activatedRoute.params.subscribe(params => {
      const caseId = params['caseId'];
      this.getCase(caseId);
    });

    this.caseSvc
      .fetchDocumentTemplate()
      .subscribe(results => this.documentTemplateTypes = results);

    this.caseSvc
      .fetchCaseType()
      .subscribe(results => this.caseTypes = results);

    this.caseSvc
      .fetchCaseStatus()
      .subscribe(results => this.caseStatuses = results);

    this.caseSvc
      .fetchEventType()
      .subscribe(types => this.eventTypes = types);
  }

  ngOnDestroy() {

    if (this.caseSubscription) this.caseSubscription.unsubscribe();
    if( this.caseTaskSubscription ) this.caseTaskSubscription.unsubscribe();
    if(this.routeSubscription) this.routeSubscription.unsubscribe();
  }

  staticMessage:any = {};

  showStaticMessage(showIt:boolean, severity?:string, detail?:string, summary?:string) {
    // info
    // success
    // warn
    // error
    this.staticMessage.visible = showIt;
    this.staticMessage.severity = severity;
    this.staticMessage.message = summary+' : '+ detail;
  }

  getCase(caseId) {
    if(caseId == 0 ) {
      this.case = new Case();
      this.loadingCase = false;
      return;
    }
    this.loadingMessage = 'loading case...';
    this.loadingCase = true;
    this.caseSubscription = this.caseSvc.fetchOne(caseId).subscribe (kase => {
      this.loadingCase = false;
      if(!kase.caseOID){
        this.toastSvc.showWarnMessage('There is no case with caseOID of '+ caseId +'.', 'No Case Found');
      } else {
        this.case = kase;

        if(this.case.caseType){
          this.caseSvc
            .fetchPhaseByType(this.case.caseType.caseTypeOID)
            .subscribe(results => this.casePhases = results);
        }

        this.eventTypeFilter = null;
        this.filterCaseEvents();
      }
    });
  }

  addNewParty() {
    this.router.navigate(['/party-detail', 0 ]);
  }

  partyOnRowSelect(event) {
    // this.showModalAddCaseParty = true;

  }

  caseOnRowSelect(event) {
    // this.showModalAddCaseCharge = true;

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

  caseTypeChange(event):void{
    if(this.case.caseType){
      this.caseSvc
        .fetchPhaseByType(this.case.caseType.caseTypeOID)
        .subscribe(results => this.casePhases = results);
    }else{
      this.casePhases = [];
    }
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
  selectedSearchPartyStartDate:Date;
  selectedSearchPartyEndDate:Date = null;
  selectedCaseParty:CaseParty = null;
  newCaseParty:CaseParty = new CaseParty();
  genderTypes:any = [{label:'M', value:'M'}, {label:'F', value:'F'},];

  searchPartyRoleTypeOnChange(event){

  }

  showAddCaseParty(){

    // if(!this.case.caseOID || this.case.caseOID == 0) {
    //   this.toastSvc.showInfoMessage('Please complete case details and Save Case before proceeding.', 'Case Details');
    //   return;
    // }

    this.newCaseParty.startDate =  this.datePipe.transform(new Date(), "MM/dd/yyyy");
    this.selectedSearchPartyStartDate = new Date();
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

  createCaseParty(){
    // this.selectedSearchParty = new CaseParty();
  }

  addPartyToCase(caseForm) {
    if(!this.selectedSearchParty) return;

    // Check for duplicate party
    let isPartyOnCase = this.case.caseParties.findIndex( item => item.caseParty.partyOID == this.selectedSearchParty.partyOID) > -1;
    if( isPartyOnCase ) {
      this.toastSvc.showWarnMessage('A party can only be added to the case once.', 'Duplicate Party');
      return;
    }

    let caseParty:CaseParty = new CaseParty();
    caseParty.caseParty = this.selectedSearchParty;
    caseParty.role = this.selectedSearchPartyRole;
    caseParty.startDate = this.selectedSearchPartyStartDate ? this.datePipe.transform(this.selectedSearchPartyStartDate, "MM/dd/yyyy") : "";
    caseParty.endDate = this.selectedSearchPartyEndDate ? this.datePipe.transform(this.selectedSearchPartyEndDate, "MM/dd/yyyy") : "";

    let caseParties:CaseParty[] = this.case.caseParties.slice();
    caseParties.push(caseParty);
    this.case.caseParties = caseParties;

    if(caseForm.valid) {
      this.saveCase();
    } else {
      this.showStaticMessage(true, 'warn', 'Please complete Case Details and click Save Case to complete.', 'Complete Case Details');
    }
    // TODO: tell the user to save the case??
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


  // new case party tab methods
  createAndAddPartyToCase(caseForm) {
    this.loadingMessage = 'saving party...';
    this.loadingCase = true;

    // CREATE LOCAL PARTY
    let party:Party = this.newCaseParty.caseParty;
    party.dob = party.dob ? this.datePipe.transform(party.dob, "MM/dd/yyyy") : "";

    // SAVE THE PARTY
    this.partySvc.saveParty(party).subscribe(result => {

      this.loadingCase = false;
      this.toastSvc.showSuccessMessage('Party saved');

      // CREATE LOCAL CASE PARTY
      let caseParty:CaseParty = this.newCaseParty;
      caseParty.startDate = caseParty.startDate ? this.datePipe.transform(caseParty.startDate, "MM/dd/yyyy") : "";
      caseParty.endDate = caseParty.endDate ? this.datePipe.transform(caseParty.endDate, "MM/dd/yyyy") : "";
      caseParty.caseParty = result;

      // ADD CASE PARTY TO CASE PARTIES
      let caseParties:CaseParty[] = this.case.caseParties.slice();
      caseParties.push(caseParty);
      this.case.caseParties =  caseParties;

      // SAVE OR NOT
      if(caseForm.valid) {
        this.saveCase();
      } else {
        this.showStaticMessage(true, 'warn', 'Please complete Case Details and click Save Case to complete.', 'Complete Case Details');
      }
      this.hideModals();

    })
  }

  saveCase(shouldShowSuccessMessage:boolean = true){

    // TODO: Validate a there is a caseParty
    // TODO: validate if court requires child party, there is one

    // if( !this.case.caseParties.length || this.case.caseParties[0].caseParty.partyOID == 0 ) {
    //   this.toastSvc.showWarnMessage('The case must have a Case Party assigned to it can be saved.', 'Case Party Needed');
    //   return;
    // }

    if( this.case.caseWeight == 0 ) {
      this.toastSvc.showWarnMessage('The Case Weight must be greater than 0', 'Case Weight Needed');
      return;
    }
    if( !this.doesCasePartyContainChild() ) {
      this.toastSvc.showWarnMessage('The case must have at least one Child Case Party assigned.', 'Child Needed');
      return;
    }

    this.loadingMessage = 'saving case...';
    this.loadingCase = true;

    let shouldRefreshURL:boolean = this.case.caseOID == 0;

    this.caseSvc
      .saveCourtCase(this.case)
      .subscribe(c => {
        this.loadingCase = false;
        this.showStaticMessage(false);
        this.case = c;
        if(shouldShowSuccessMessage){
          this.toastSvc.showSuccessMessage("Case Saved");
        }
        if(shouldRefreshURL) {
          this.router.navigate([ '/case-detail', this.case.caseOID ])
        }
      });
  }

  doesCasePartyContainChild():boolean {
     return this.case.caseParties.findIndex( cp => cp.role.casePartyRoleOID == 1) > -1;
  }

  newCPfNameChanged(event) {
    this.newCaseParty.caseParty.firstName = event;
  }

  newCPlNameChanged(event) {
    this.newCaseParty.caseParty.lastName = event;
  }

  newCPaltNameChanged(event) {
    console.log('newCPaltNameChanged(event)', event)
    this.newCaseParty.caseParty.alternativeName = event;
  }

  newCPdobChange(event) {
    console.log(event);
    this.newCaseParty.caseParty.dob = event;
  }

  newCPsexChange(event) {
    this.newCaseParty.caseParty.sex = event;
  }

  newCasePartyRoleTypeOnChange(event){
    console.log(event);
    this.newCaseParty.role = event.value;
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
    if(!this.case.caseOID || this.case.caseOID == 0) {
      this.toastSvc.showInfoMessage('Please complete case details and Save Case before proceeding.', 'Complete Case Details');
      return;
    }

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
    this.showStaticMessage(true, 'warn', 'Click "Save Case" to save Charges to the Case.', 'Unsaved Values');
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



  // ------------------------------------------------
  //   ADD CASE TASK MODAL
  // -----------------------------------------------=

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
  loadingCaseTaskLookups: boolean = false;

  createCaseTask( taskTypeId? ) {
    this.selectedCaseTask = new CaseTask();
    this.onShowCaseTaskModal(taskTypeId);
  }

  taskOnRowSelect(event){
    this.selectedCaseTask = event.data;
    this.onShowCaseTaskModal();
    console.log('taskOnRowSelect selected case task', this.selectedCaseTask)
  }

  onShowCaseTaskModal(taskTypeId?){
    this.showModalAddCaseTask = true;
    if(this.caseTaskSubscription) {
      this.initCaseTaskModal(taskTypeId);
      return;
    }
    this.loadingCaseTaskLookups = true;
    var source = Observable.forkJoin<any>(
      this.partySvc.fetchAny({courtUser: "true"}),
      this.lookupSvc.fetchLookup<TaskType>('FetchTaskType'),
      this.lookupSvc.fetchLookup<Pool>('FetchStaffPool')
    );
    this.caseTaskSubscription = source.subscribe(
      results => {
        this.taskParties = results[0] as Party[];
        this.taskTypes = results[1] as TaskType[];
        this.staffPools = results[2] as Pool[];

        this.initCaseTaskModal(taskTypeId);
      });
  }

  initCaseTaskModal(taskTypeId?) {
    this.loadingCaseTaskLookups = false;
    if(taskTypeId){
      this.selectedCaseTask.taskType = this.taskTypes.find((task) => task.taskTypeOID == taskTypeId );
    }

    if(this.selectedCaseTask.assignedParty){
      this.selectedCaseTask.assignedParty = this.taskParties.find(p => p.partyOID == this.selectedCaseTask.assignedParty.partyOID);
    }

    if(this.selectedCaseTask.assignedPool){
      this.selectedCaseTask.assignedPool = this.staffPools.find(s => s.poolOID == this.selectedCaseTask.assignedPool.poolOID);
    }

  }

  onCancelCaseTask(form) {
    this.hideModals();
    // form.reset();  // this is deleting the selectedItem from the grid!!??~
    this.selectedCaseTask = null;
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
      let savedTask = result[0];

      Object.assign(this.selectedCaseTask.assignedParty, savedTask.assignedParty);
      Object.assign(this.selectedCaseTask.assignedPool, savedTask.assignedPool);
      this.selectedCaseTask.taskOID = savedTask.taskOID;

      let task = this.selectedCaseTask;

      // see if item exists in list
      let idx = this.case.caseTasks.findIndex( item => item.taskOID == task.taskOID );

      if(idx > -1) this.case.caseTasks[idx] = task;
      else {
        this.case.caseTasks.push(task);
        this.case.caseTasks = this.case.caseTasks.slice();
      }

      // Refresh the grid --------
      // this.case.caseTasks = this.case.caseTasks.slice();

      this.toastSvc.showSuccessMessage('Your case task has been saved.', 'Task Saved');
      this.hideModals();
      this.selectedCaseTask = null;
    });
  }

  taskTypeOnChange(event) {
    this.selectedCaseTask.taskType = event.value;
  }

  priorityTypeOnChange(event){
    this.selectedCaseTask.taskPriorityCode = event.value;
  }

  assignedPersonTypeOnChange(event) {
    this.selectedCaseTask.assignedParty = this.taskParties.find(item => item.partyOID == event.value);
  }

  staffPoolTypeOnChange(event) {
    this.selectedCaseTask.assignedPool = event.value;
  }

  dueDateOnChange(event){
    this.selectedCaseTask.dueDate = event;
  }

  taskDetailsOnChange(event){
    this.selectedCaseTask.details = event;
  }


  // -------------------------
  //   HEARING MODAL
  // ------------------------=

  addHearingTask() {
    console.log('activeTabIndex BEFORE', this.activeTabIndex)
    this.activeTabIndex = 1;
    console.log('activeTabIndex AFTER', this.activeTabIndex)
    this.hideModals();
    this.createCaseTask(1);
  }




  // -------------------------
  //   ADD JUDGE MODAL
  // ------------------------=

  showModalAddJudge: boolean = false;
  judges: JudicialOfficer[];
  judge: JudicialAssignment = new JudicialAssignment();


  onShowJudgeModal(){
    this.showModalAddJudge = true;

    this.caseSvc
      .fetchJudicialOfficer()
      .subscribe(judges => {
        this.judges = judges;

        if(this.judge.judicialOfficial){
          this.judge.judicialOfficial = judges
            .find(j => j.partyOID == this.judge.judicialOfficial.partyOID);
        }
      });
  }

  saveJudge(){
    this.judge.caseOID = this.case.caseOID;

    this.caseSvc
      .saveJudicialAssignment(this.judge)
      .subscribe(assignment =>{
        let index:number = this.case.judicialAssignments
          .find(a => a.judicialAssignmentOID == assignment.judicialAssignmentOID);

        if(index >= 0){
          this.case.judicialAssignments[index] = assignment;
        }else{
          this.case.judicialAssignments.push(assignment);
          this.case.judicialAssignments = this.case.judicialAssignments.slice();
        }
      });

      this.showModalAddJudge = false;
  }

  requestViewJudicialAssignment(judge):void{
    this.judge = judge;

    this.onShowJudgeModal();
  }

  // -------------------------
  //   ADD COMPLETED EVENT MODAL
  //   (in Register tab)
  // ------------------------=

  showModalAddEvent: boolean = false;
  events: any[];
  filteredEvents:CaseEvent[] = [];
  caseEvent: CaseEvent = new CaseEvent();
  eventTypes: EventType[]; // verify correct data type
  eventParties: Party[];   // verify correct data type
  documents: any[];
  selectedInitiatedByParty: CaseParty;
  eventTypeFilter:EventType = null;

  eventTypeFilterChange(event):void{
    this.filterCaseEvents();
  }

  clearEventFilter():void{
    this.eventTypeFilter = null;
    this.filterCaseEvents();
  }

  caseEventOnRowSelect(event):void{
    this.caseEvent = event.data;
  }

  requestViewCaseEvent(){
    this.showEventModal();
  }

  addCaseEventClicked(){
    this.caseEvent = new CaseEvent();

    this.showEventModal();
  }

  showEventModal(){
    this.showModalAddEvent = true;

    if(this.caseEvent.initiatedByParty){
      this.selectedInitiatedByParty = this.case.caseParties
        .find(cp => cp.caseParty.partyOID == this.caseEvent.initiatedByParty.partyOID);
    }else{
      this.selectedInitiatedByParty = null;
    }

    this.caseEvent.caseOID = this.case.caseOID;
  }

  saveEvent(){

    this.caseEvent.initiatedByParty = this.selectedInitiatedByParty.caseParty;

    this.caseSvc
      .saveCaseEvent(this.caseEvent)
      .subscribe(savedCaseEvent => {
        savedCaseEvent.eventType = this.eventTypes.find(e => e.eventTypeOID == savedCaseEvent.eventType.eventTypeOID);

        let index:number = this.case.caseEvents
          .findIndex(ce => ce.caseEventOID == savedCaseEvent.caseEventOID);

        if(index >= 0){
          this.case.caseEvents[index] = savedCaseEvent;
        }else{
          this.case.caseEvents.push(savedCaseEvent);
          this.case.caseEvents = this.case.caseEvents.slice();
        }
      });

    this.showModalAddEvent = false;
  }

  filterCaseEvents():void{
    if(this.eventTypeFilter && this.case.caseEvents){
      this.filteredEvents = this.case.caseEvents
        .filter(e => e.eventType.eventTypeOID == this.eventTypeFilter.eventTypeOID);
    }else{
      this.filteredEvents = this.case.caseEvents;
    }
  }

  // -------------------------
  //   DOCUMENTS TAB
  //
  // ------------------------=
  generateDoc():void{
    this.caseSvc
      .downloadCourtDocument(this.case.caseOID, this.selectedDocumentTemplateType.documentTemplateOID)
      .subscribe();
  }

  uploadedFiles: any[] = [];

  onUpload(event) {
    for(let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.toastSvc.showSuccessMessage('File Uploaded');
  }

  ddOnChange(event):void{
    //This event handler is called multiple places but did not exist.
    //Created as a placeholder.
  }

}
