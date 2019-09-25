import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { SelectItem } from 'primeng/primeng';
import { ObjectUtils } from '../../common/utils/object-utils';
import { Pool } from '../../common/entities/Pool';
import { EventType } from '../../common/entities/EventType';
import { CasePartyRole } from '../../common/entities/CasePartyRole';
import { BreadcrumbService } from '../../breadcrumb.service';
import { CaseEvent } from '../../common/entities/CaseEvent';
import { CaseDocument } from '../../common/entities/CaseDocument';
import { Case } from '../../common/entities/Case';
import { CaseCharge } from '../../common/entities/CaseCharge';
import { CaseService } from '../../common/services/http/case.service';
import { CaseTask } from '../../common/entities/CaseTask';
import { DocTemplate } from '../../common/entities/DocTemplate';
import { Party } from '../../common/entities/Party';
import { TaskType } from '../../common/entities/TaskType';
import { IccsCode } from '../../common/entities/IccsCode';
import { ChargeFactor } from '../../common/entities/ChargeFactor';
import { ChargeFactorVariable } from '../../common/entities/ChargeFactorVariable'; //RS
import { ChargeFactorCategory } from '../../common/entities/ChargeFactorCategory'; //RS
import { ToastService } from '../../common/services/utility/toast.service';
import { CollectionUtil } from '../../common/utils/collection-util';
import { PartyService } from '../../common/services/http/party.service';
import { CaseParty } from '../../common/entities/CaseParty';
import { LookupService } from '../../common/services/http/lookup.service';
import { CaseTaskDTO } from '../../common/entities/CaseTaskDTO';
import { JudicialAssignment } from '../../common/entities/JudicialAssignment';
import { JudicialOfficer } from '../../common/entities/JudicialOfficer';
import { CaseType } from '../../common/entities/CaseType';
import { CaseDispositionType } from '../../common/entities/CaseDispositionType';
import { CaseStatus } from '../../common/entities/CaseStatus';
import { CasePhase } from '../../common/entities/CasePhase';
import { CaseSubType } from '../../common/entities/CaseSubType';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../common/services/utility/local-storage.service';
import { DateUtils } from '../../common/utils/date-utils';
import { UserService } from '../../common/services/utility/user.service';
import { Permission } from '../../common/entities/Permission';
import { LocalCharge } from '../../common/entities/LocalCharge';
import { IccsCodeCategory } from '../../common/entities/IccsCodeCategory';
import { CaseApplication } from '../../common/entities/CaseApplication';
import { componentRefresh } from '@angular/core/src/render3/instructions';
import { CaseApplicant } from '../../common/entities/CaseApplicant';
import { PaymentDisbursementDetails } from '../../common/entities/PaymentDisbursementDetails';
import { CasePayment } from '../../common/entities/CasePayment';
import { CaseApplicationType } from '../../common/entities/CaseApplicationType';
import { CountriesService } from '../../common/services/http/countries.service';
import { DropdownDataTransformService } from '../../common/services/utility/dropdown-data-transform.service';
import { isNumber } from 'util';

@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html',
  styleUrls: ['./case-detail.component.scss']
})
export class CaseDetailComponent implements OnInit, OnDestroy {

  @ViewChild('caseForm') caseForm: any;

  authToken: string;
  activeTabIndex: number = 1;
  case: Case;
  caseSubscription: Subscription;
  caseTaskSubscription: Subscription;
  caseWeightRanges: number[] = [1, 10];
  loadingCase: boolean = false;
  loadingMessage: string = 'loading case...';
  showLoadingBar: boolean = false;
  selectedCharge: CaseCharge;
  selectedParty: Party;
  selectedDoc: CaseDocument;
  selectedEvent: CaseEvent;
  selectedJudicialAssignment: any;
  documentTemplateTypes: DocTemplate[] = [];
  selectedDocumentTemplateType: DocTemplate;
  routeSubscription: Subscription;
  caseTypes: CaseType[] = [];
  caseApplicationTypes: CaseApplicationType[] = [];
  caseDispositionTypes: CaseDispositionType[] = [];
  caseStatuses: CaseStatus[] = [];
  casePhases: CasePhase[] = [];
  caseSubTypes: CaseSubType[] = [];
  baseURL: string;
  selectedChargeLawTypeId: any;
  appCaseParties: Party[] = [];
  paymentCaseParties: Party[] = [];
  datePipe: DatePipe = new DatePipe("en");
  actualCompletionDate: Date = null;
  selChargeFactor: string = ""; 
  casePartyRoleTypes: CasePartyRole[];  
  caseApplications: CaseApplication[] = []; // used to capture all applications for a case
  casePayment: CasePayment[] = []; // used to capture all applications for a case
  selectedCaseApplication: CaseApplication = new CaseApplication();
  selectedCasePayment: CasePayment = new CasePayment();
  newPaymentDisbursementDetail: PaymentDisbursementDetails = new PaymentDisbursementDetails();
  paymentDisbursementDetails: PaymentDisbursementDetails [] = [];

  countries: SelectItem[];
  countriesSubscription: Subscription;
  permissionSupervisor: boolean = false; //used to lock payment records
  disbursementToggle: boolean = false; //used to lock payment records
  
 

  public Permission: any = Permission;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breadCrumbSvc: BreadcrumbService,
    private caseSvc: CaseService,
    private partySvc: PartyService,
    private router: Router,
    private toastSvc: ToastService,
    private lookupSvc: LookupService,
    private localStorageService: LocalStorageService,
    private countriesSvc: CountriesService,
    private dropdownSvc: DropdownDataTransformService,
    private userSvc: UserService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Case', routerLink: ['/case-detail'] }
    ]);

    if (localStorageService.hasValue('AUTH_TOKEN')) {
      this.authToken = localStorageService.getValue('AUTH_TOKEN');
    }
  }



  ngOnInit() {

    this.baseURL = environment.apiUrl;
    this.permissionSupervisor = this.userSvc.isSupervisor();

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
      .fetchCaseDispositionType()
      .subscribe(results => this.caseDispositionTypes = results);   

    this.caseSvc
      .fetchEventType()
      .subscribe(types => this.eventTypes = types);

    this.caseSvc
      .fetchCasePartyRole()
      .subscribe(roles => this.casePartyRoleTypes = roles);

      this.caseSvc
      .fetchCaseApplicationType()
      .subscribe(appTypes => this.caseApplicationTypes = appTypes);

      this.countriesSubscription = this.countriesSvc.get().subscribe(countries => {
        this.countries = this.dropdownSvc.transformSameLabelAndValue(countries, 'name');

      })    

  }

  ngOnDestroy() {

    if (this.caseSubscription) this.caseSubscription.unsubscribe();
    if (this.caseTaskSubscription) this.caseTaskSubscription.unsubscribe();
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
    if (this.countriesSubscription) this.countriesSubscription.unsubscribe();
  }

  hasPermission(pm) {
    if (!this.case) return false;
    return this.userSvc.hasPermission(pm);
    // if (!this.case || !this.case.court) return false;
    // let courtOID = this.case.court.courtOID;
    // return this.userSvc.hasPermission(pm, courtOID);
  }

  staticMessage: any = {};

  showStaticMessage(showIt: boolean, severity?: string, detail?: string, summary?: string) {
    // info
    // success
    // warn
    // error
    this.staticMessage.visible = showIt;
    this.staticMessage.severity = severity;
    this.staticMessage.message = summary + ' : ' + detail;
  }

  getCase(caseId) {
    this.caseForm.reset();
    if (caseId == 0) {
      this.case = new Case();
      this.loadingCase = false;
      return;
    }
    this.loadingMessage = 'loading case...';
    this.loadingCase = true;

    


    this.caseSubscription = this.caseSvc.fetchOne(caseId).subscribe(kase => {
      this.loadingCase = false;
      if (!kase.caseOID) {
        this.toastSvc.showWarnMessage('There is no case with caseOID of ' + caseId + '.', 'No Case Found');
      } else {
        this.case = kase;
        console.log("Loading Current Case",kase);
        // Remove all files with a '^' in the docName - they are orphans
        this.case.caseDocs = this.case.caseDocs.filter(cd => {
          return cd.documentName.indexOf('^') == -1;
        })

        if (this.case.caseType) {
          
          //load filtered case phases
          this.caseSvc
            .fetchPhaseByType(this.case.caseType.caseTypeOID)
            .subscribe(results => this.casePhases = results);

          //load filtered case sub types  
          this.caseSvc
            .fetchCaseSubType(this.case.caseType.caseTypeOID)
            .subscribe(results => this.caseSubTypes = results);  
        }
        
        if (this.case.caseParties.length > 0) {
          this.case.caseParties.map(cp => {
            cp.caseParty.age = this.calculateAge(cp.caseParty.dob);
          })
        }
        
        for (let i = 0; i < this.case.caseTasks.length; i++){
          this.case.caseTasks[i].taskPriorityDesc = this.priorityCodeDesc(this.case.caseTasks[i].taskPriorityCode);        
        }

        //cannot use any other object besides the Case object since it is binded to the case service
        this.caseSvc
          .fetchCaseApplication(caseId)
          .subscribe(results => this.case.caseApplications = results);
          
        //This returns all the case payments for that particular application  
        this.caseSvc
          .fetchCasePayments(caseId)
          .subscribe(results => this.case.casePayments = results);  

        //console.log('Case Payments received for this case is', this.case.casePayments);

        this.caseSvc
        .fetchCasePaymentDetails(caseId)
        .subscribe(results => this.case.casePaymentsDetails = results);  
         
        this.eventTypeFilter = null;
        this.filterCaseEvents();
      }
    });
  }


  addNewParty() {
    this.router.navigate(['/party-detail', 0]);
  }

  caseOnRowSelect(event) {
    // this.showModalAddCaseCharge = true;
  }

  chargeOnRowSelect(event) {

  }
  eventOnRowSelect(event) {

  }

  docOnRowSelect(event) {

  }

  caseTypeChange(event): void {
    if (this.case.caseType) {
      
      //Load case phases
      this.caseSvc
        .fetchPhaseByType(this.case.caseType.caseTypeOID)
        .subscribe(results => this.casePhases = results);

      //Load case sub types
      this.caseSvc
        .fetchCaseSubType(this.case.caseType.caseTypeOID)
        .subscribe(results => this.caseSubTypes = results);

    } else {
      this.casePhases = [];
      this.caseSubTypes = [];
    }
  }

  caseSubTypeChange(event): void {
    if (this.case.caseSubType) {
      this.caseSvc
        .fetchCaseSubType(this.case.caseType.caseTypeOID)
        .subscribe(results => this.caseSubTypes = results);
    } else {
      this.caseSubTypes = [];
    }
  }

  isCaseTypeSelected($event){
    if (!this.case.caseType)
      this.toastSvc.showWarnMessage('Please choose Case Type first')
  }

 
  caseDispositionTypeChange(event): void {
    if (this.case.caseDispositionType) {
      this.caseSvc
      .fetchCaseDispositionType()
      .subscribe(results => this.caseDispositionTypes = results);
    }
  }


  priorityCodeDesc(taskPriorityCode): string {

    if(taskPriorityCode == 0)
    return "N/A";

    else if(taskPriorityCode == 1)
    return "Urgent";

    else if(taskPriorityCode == 2)
    return "High";

    else return "Normal";
}


  // MODALS --------------------------------------------

  hideModals() {

    this.showModalAddCaseCharge = false;
    this.showModalAddCaseParty = false;
    this.showModalAddCaseApplication = false;
    this.showModalAddCaseTask = false;
    this.showModalAddCasePayment = false;
    this.showModalAddJudge = false;
    this.showModalAddEvent = false;
    this.showDeleteChargeModal = false;
    this.showDeletePartyModal = false;
    this.showModalEditCaseParty = false;
  }

  // -------------------------
  //   ADD CASE PARTY MODAL
  // ------------------------=

  showModalAddCaseParty: boolean = false;
  showDeletePartyModal: boolean = false;
  showModalEditCaseParty: boolean = false;
  partySearchText: string;
  searchPartyResults: Party[];
 
  selectedSearchParty: Party;
  selectedSearchPartyRole: CasePartyRole = null;
  selectedSearchPartyStartDate: Date;
  selectedSearchPartyEndDate: Date = null;
  selectedCaseParty: CaseParty = null;
  newCaseParty: CaseParty = new CaseParty();
  genderTypes: any = [{ label: 'M', value: 'M' }, { label: 'F', value: 'F' },];

  // -------------------------
  //  START: ADD CASE APPLICATION
  // -------------------------

  showModalAddCaseApplication: boolean = false;
  showModalAddCaseOrder: boolean = false;
  showModalMaintenancePayments = false;

  applicationStatus: any[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Closed', label: 'Closed' }
  ];

  paymentItem: any[] = [
    { value: 'Maintenance: General', label: 'Maintenance: General' },
    { value: 'Maintenance: Clothing', label: 'Maintenance: Clothing' },
    { value: 'Maintenance: Medical', label: 'Maintenance: Medical' },
    { value: 'Maintenance: School Books & Uniform', label: 'Maintenance: School Books & Uniform' },
    { value: 'Writs of Execution', label: 'Writs of Execution' },
    { value: 'Writs of Possession', label: 'Writs of Possession' },
    { value: 'Fines Payment', label: 'Fines Payment' },
    { value: 'Filing Fees', label: 'Filing Fees' }
  ];

  paymentMethod: any[] = [
    { value: 'ACH Credit transfer', label: 'ACH Credit transfer' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Cheque', label: 'Cheque' },
    { value: 'Court Pay', label: 'Court Pay' },
    { value: 'Credit Card', label: 'Credit Card' },   
    { value: 'Manager’s Cheque', label: 'Manager’s Cheque' },
    { value: 'Personal Cheque', label: 'Personal Cheque' }

  ];

  paymentTypes: any[] = [
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Fines Payment', label: 'Fines Payment' },
    { value: 'Filing Fees', label: 'Filing Fees' },
    { value: 'Revenue Fees', label: 'Revenue Fees' },
    { value: 'Writs of Execution', label: 'Writs of Execution' },
    { value: 'Writs of Possession', label: 'Writs of Possession' },
    { value: 'Warrant', label: 'Warrant' }
  ];

  paymentFrequency: any[] = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Yearly', label: 'Yearly' },
    { value: 'Fortnightly', label: 'Fortnightly' },
    { value: 'One Time Payment', label: 'One Time Payment' },
    { value: 'Custom Days', label: 'Custom Days' }
  ];  


  applicationTypeOnChange(event) {
    this.selectedCaseApplication.caseApplicationType = event.value.caseApplicationTypeOID;
    this.selectedCaseApplication.caseApplicationTypeDisplay = event.value.shortName;
  }

  applicationStatusOnChange(event) {
    this.selectedCaseApplication.caseApplicationStatus = event.value;
  }

  paymentItemOnChange(event,acIdx) {
    //console.log('paymentItemOnChange',event);
    this.selectedCasePayment.paymentsDisbursements[acIdx].paymentItem = event;
  }

  paymentFrequencyOnChange(event,acIdx) {
    this.selectedCasePayment.paymentsDisbursements[acIdx].paymentFrequency = event;
  }

  paymentAmountInOnChange(event,acIdx) {
    console.log('paymentAmountInOnChange',event);
    this.selectedCasePayment.paymentsDisbursements[acIdx].paymentAmountIn = event;
  }

  paymentAmountOrderedOnChange(event,acIdx) {
    this.selectedCasePayment.paymentsDisbursements[acIdx].paymentAmountOrdered = event;
  }  

  /*paymentAmountOutOnChange(event,acIdx) {
    this.selectedCasePayment.paymentsDisbursements[acIdx].paymentAmountOut = event;
  }*/

  receiptNumberOnChange(event) {
    this.selectedCasePayment.receiptNumber = event;
  }

  processingFeeOnChange(event) {
    this.selectedCasePayment.processingFee = event;
  }  

  totalAmountPainInOnChange(event) {
    this.selectedCasePayment.totalPaymentIn = event;
    console.log('Total Amount Paid In',this.selectedCasePayment.totalPaymentIn);
  }   

  /*totalAmountPainOutOnChange(event) {
    this.selectedCasePayment.totalPaymentOut = event;
  } */

  payorOnChange(event) {
    this.selectedCasePayment.payorParty = event.value;
  }  

  beneficiaryOnChange(event) {
    this.selectedCasePayment.beneficiaryParty = event.value;
  } 

  paymentMethodOnChange(event) {
    this.selectedCasePayment.paymentMethod = event.value;
  }  
  
  paymentTypeOnChange(event) {
    this.selectedCasePayment.paymentType = event.value;
  }   

  applicantRoleTypeOnChange(event){
    this.selectedCaseApplication.caseApplicationRole = event.value.casePartyRoleOID;
  }

  compareByCasePartyId(item1, item2) {
    return item1.partyOID == item2.caseApplicantPartyOID;
  }

  compareByCasePartyIdPayments(item1, item2) {
    return item1.partyOID == item2.partyOID;
  }

  compareByCasePartyRoleId(item1, item2) {
    return item1.casePartyRoleOID == item2.caseApplicantRoleOID;
  }

  addCaseApplicant() {
    let newApplicant = new CaseApplicant();
    let authPartyAppLen = this.selectedCaseApplication.caseApplicants.push(newApplicant);
  }



  caseApplicantOnChange(event, authCourtIdx) {

    this.selectedCaseApplication.caseApplicants[authCourtIdx].caseApplicantPartyOID = event.value.partyOID; 
    this.selectedCaseApplication.caseApplicants[authCourtIdx].caseOID = this.case.caseOID;
  }

  caseApplicantRoleOnChange (event, authCourtIdx) {
    this.selectedCaseApplication.caseApplicants[authCourtIdx].caseApplicantRoleOID = event.value.casePartyRoleOID; 
  }

  requestDeleteCasePartyApplicant(authCourtIdx) {
    this.selectedCaseApplication.caseApplicants.splice(authCourtIdx, 1);
  }

  requestDeleteCasePaymentDetail(authCourtIdx) {
    this.selectedCasePayment.paymentsDisbursements.splice(authCourtIdx, 1);
  }

  editStreetAddressOnChange(event){
    this.selectedCaseApplication.aomStreetName = event;
  }

  editCityAddressOnChange(event){
    this.selectedCaseApplication.aomCityName = event;
  }

  addCaseApplication(){

    // The conversion of the data types is done on the server side.
    // The JSON string on the server side is parsed according to the object structure.    
    
    // Get the current list of case applicants.
    // A case application needs at least one applicant to be a valid case application
    // Applicants can be added as needed
   
    if(this.selectedCaseApplication.caseApplicants.length > 0){ 

       //Store all case applications 
        this.case.caseApplications.push(this.selectedCaseApplication);

        //Set the values to be used to generate an application number
        //The application type code is set then the case type is selected upon the initial
        //creation of the application.
        this.selectedCaseApplication.numOfCaseApplications = this.case.caseApplications.length;
        this.selectedCaseApplication.caseNumberDisplay = this.case.caseNumber;
        this.selectedCaseApplication.caseOID = this.case.caseOID;

        this.caseSvc.saveCaseApplication(this.selectedCaseApplication).subscribe(result => {
        this.selectedCaseApplication = result[0];
        });

        this.toastSvc.showSuccessMessage('Case Application Saved');
   
    }
    else this.toastSvc.showWarnMessage('An application must contain one or more applicants', 'Case Application was not saved');


    this.saveCase();
     
    //After an application is saved, reset so fresh data can be reloaded
    this.selectedCaseApplication = new CaseApplication ();
    this.selectedCaseApplication.caseApplicants = null;
    this.hideModals();
  }

  addCasePayment(){

    

    // The conversion of the data types is done on the server side.
    // The JSON string on the server side is parsed according to the object structure.    
    
    // Get the current list of case payments.
    // A case payment needs at least one payment detail to be a valid case payment
    // payment details can be added as needed
    
  
    if(this.selectedCasePayment.paymentsDisbursements.length > 0){ 

       //Store all case payments 
       
        this.case.casePayments.push(this.selectedCasePayment); //not working for some reason
        console.log('Case Payment Details to be saved are', this.selectedCasePayment);

        //Set the values to be used to generate an application number
        //The application type code is set then the case type is selected upon the initial
        //creation of the application.

        this.selectedCasePayment.caseNumber = this.case.caseNumber;
        this.selectedCasePayment.caseOID = this.case.caseOID;
        this.selectedCasePayment.payorOID = this.selectedCasePayment.payorParty.partyOID;
        this.selectedCasePayment.beneficiaryOID = this.selectedCasePayment.beneficiaryParty.partyOID;

        this.caseSvc.saveCasePayment(this.selectedCasePayment).subscribe(result => {
          this.selectedCasePayment = result[0];
        });

        this.toastSvc.showSuccessMessage('Case Payment Saved');
        this.saveCase();        
    }
    
    else this.toastSvc.showWarnMessage('An payment must contain one or more payment detail', 'Case payment was not saved');    
  
    this.caseSvc
    .fetchCasePaymentDetails(this.case.caseOID)
    .subscribe(results => this.case.casePaymentsDetails = results);  
 
    //After a payment is saved, reset so fresh data can be reloaded
    this.selectedCasePayment = new CasePayment ();
    this.selectedCasePayment.paymentsDisbursements = null;
    this.hideModals();
  }


  caseApplicationStartDateOnChange(event) {
    this.selectedCaseApplication.caseApplicationStartDate = event;
  }

  caseApplicationEndDateOnChange(event) {
    this.selectedCaseApplication.caseApplicationEndDate = event;
  }

  dateOfMarriageOnChange(event) {
    this.selectedCaseApplication.dateOfMarriage = event;
  }

  countryOfMarriageOnChange(event) {
    this.selectedCaseApplication.aomCountryName = event.value;
  }

  resetAddCaseApplicationModal(){
    this.selectedCaseApplication = new CaseApplication();
    this.showAddCaseCaseApplication();
  }

  resetAddCasePaymentModal(){
    this.selectedCasePayment = new CasePayment();
    //this.disbursementToggle = false;
    this.ShowAddCasePayment();
  }

  showAddCaseCaseApplication() { 

    this.showModalAddCaseApplication = true;
  
    //Convert the dates for the selected applications
    this.caseSvc.convertCaseApplicationDates(this.selectedCaseApplication);
    
    //Load the current parties associated with this case
    for (let i = 0; i < this.case.caseParties.length; i++){
      this.appCaseParties[i] = this.case.caseParties[i].caseParty;    
      this.appCaseParties[i].fullName = this.appCaseParties[i].firstName.concat(" ",this.appCaseParties[i].lastName);   
    }

    if(this.selectedCaseApplication.caseApplicationOID == 0){
      this.case.caseApplicants = [];
    }

  }

  addCasePaymentDisbursement(){
    let newPaymentDisbursement = new PaymentDisbursementDetails();
    let authPaymentDisbursementLen = this.selectedCasePayment.paymentsDisbursements.push(newPaymentDisbursement);
    console.log('Payment Details are ', this.selectedCasePayment.paymentsDisbursements);
  }

  ShowAddCasePayment() {
     
    this.showModalAddCasePayment = true;
    console.log('Case Payment Selected is ',this.selectedCasePayment);
    this.caseSvc.convertCasePaymentDetailDates(this.selectedCasePayment);
    
    if(this.selectedCasePayment.paymentOID == 0){
      this.selectedCasePayment.paymentDisbursedFlag = false;
      this.selectedCasePayment.disbursementDate = null;
    }

    if(this.selectedCasePayment.paymentDisbursedFlag == true){
      this.disbursementToggle = true;
    }
    
    //Populate the options for payor and beneficiary dropdown list
    for (let i = 0; i < this.case.caseParties.length; i++){

      this.paymentCaseParties[i] = new Party();
      this.paymentCaseParties[i].partyOID = this.case.caseParties[i].caseParty.partyOID;   
      this.paymentCaseParties[i].firstName = this.case.caseParties[i].caseParty.firstName;   
      this.paymentCaseParties[i].lastName = this.case.caseParties[i].caseParty.lastName;    
      this.paymentCaseParties[i].fullName = this.case.caseParties[i].caseParty.firstName.concat(" ",this.case.caseParties[i].caseParty.lastName);   
    }

    //Initialize the modal with the Party that was retrieved from the server
    this.selectedCasePayment.payorParty = this.paymentCaseParties.find((party) => party.partyOID == this.selectedCasePayment.payorOID);
    this.selectedCasePayment.beneficiaryParty = this.paymentCaseParties.find((party) => party.partyOID == this.selectedCasePayment.beneficiaryOID);
   
  }

  disbursementCompletedOnChange(event){
    this.selectedCasePayment.paymentDisbursedFlag = event;
    if(this.selectedCasePayment.paymentDisbursedFlag){
      //this.disbursementToggle = true;
      this.toastSvc.showInfoMessage('You have marked this payment as disbursed');   
    } 
    else{
      this.toastSvc.showInfoMessage('This payment was reimbursed to the court');   
      this.selectedCasePayment.disbursementDate = null;
    }  
  }


  // -------------------------
  //   END: ADD CASE APPLICATION
  // -------------------------

  searchPartyRoleTypeOnChange(event) {
  }

  partyOnRowSelect(event) {

    if (!this.hasPermission(this.Permission.UPDATE_CASE)) return false;
    this.selectedCaseParty = event.data;
    this.showModalEditCaseParty = true;
    // TODO: SHOW DROPDOWNS AS TEXT IN FORM
    // ONLY END DATE CAN BE EDITED
  }

  showAddCaseParty() {
    // this.newCaseParty.startDate =  this.datePipe.transform(new Date(), "MM/dd/yyyy");
    this.newCaseParty.startDate = new Date();
    this.selectedSearchPartyStartDate = new Date();
    this.showModalAddCaseParty = true;

    /*this.caseSvc
      .fetchCasePartyRole()
      .subscribe(roles => this.casePartyRoleTypes = roles);*/
  }

  searchForParty() {
    let obj = { "partyName": this.partySearchText };
    this.partySvc
      .fetchAny(obj)
      .subscribe(results => {
        this.searchPartyResults = results;

        if (results.length) {
          this.selectedSearchParty = results[0];
        }
        this.searchPartyResults.map(cp => {
          cp.age = this.calculateAge(cp.dob);
        })
      });
  }

  searchPartyOnRowSelect(event) {
    this.selectedSearchParty = event.data;
    this.selectedSearchPartyRole = null;
    this.selectedSearchPartyStartDate = null;
    this.selectedSearchPartyEndDate = null;
  }

  addPartyToCase(caseForm) {
    if (!this.selectedSearchParty) return;

    // Check for duplicate party
    let isPartyOnCase = this.case.caseParties.findIndex(item => item.caseParty.partyOID == this.selectedSearchParty.partyOID) > -1;
    if (isPartyOnCase) {
      this.toastSvc.showWarnMessage('A party can only be added to the case once.', 'Duplicate Party');
      return;
    }

    let caseParty: CaseParty = new CaseParty();
    caseParty.caseParty = this.selectedSearchParty;
    caseParty.role = this.selectedSearchPartyRole;
    caseParty.startDate = this.selectedSearchPartyStartDate ? this.datePipe.transform(this.selectedSearchPartyStartDate, "MM/dd/yyyy") : "";
    caseParty.endDate = this.selectedSearchPartyEndDate ? this.datePipe.transform(this.selectedSearchPartyEndDate, "MM/dd/yyyy") : "";

    let caseParties: CaseParty[] = this.case.caseParties.slice();
    caseParties.push(caseParty);
    this.case.caseParties = caseParties;

    if (caseForm.valid) {
      this.saveCase();
    } else {
      this.showStaticMessage(true, 'warn', 'Please complete Case Details and click Save Case to complete.', 'Complete Case Details');
    }
    // TODO: tell the user to save the case??
    this.hideModals();
  }

  calculateAge(dob) {
    return DateUtils.calculateAge(dob);
  }

  requestDeleteParty(party: CaseParty): void {
    this.selectedCaseParty = party;
    this.showDeletePartyModal = true;
  }

  deleteParty(): void {
    CollectionUtil.removeArrayItem(this.case.caseParties, this.selectedCaseParty);
    this.case.caseParties = this.case.caseParties.slice();
    this.showDeletePartyModal = false;
    this.saveCase(false);
  }

  createAndAddPartyToCase(caseForm) {
    this.loadingMessage = 'saving party...';
    this.loadingCase = true;

    // CREATE LOCAL PARTY
    let party: Party = this.newCaseParty.caseParty;
    party.dob = party.dob ? this.datePipe.transform(party.dob, "MM/dd/yyyy") : "";

    // SAVE THE PARTY
    this.partySvc.saveParty(party).subscribe(result => {

      this.loadingCase = false;
      this.toastSvc.showSuccessMessage('Party saved');

      // CREATE LOCAL CASE PARTY
      let caseParty: CaseParty = this.newCaseParty;
      caseParty.startDate = caseParty.startDate ? this.datePipe.transform(caseParty.startDate, "MM/dd/yyyy") : "";
      caseParty.endDate = caseParty.endDate ? this.datePipe.transform(caseParty.endDate, "MM/dd/yyyy") : "";
      caseParty.caseParty = result;

      // ADD CASE PARTY TO CASE PARTIES
      let caseParties: CaseParty[] = this.case.caseParties.slice();
      caseParties.push(caseParty);
      this.case.caseParties = caseParties;

      // SAVE OR NOT
      if (caseForm.valid) {
        this.saveCase();
      } else {
        this.showStaticMessage(true, 'warn', 'Please complete Case Details and click Save Case to complete.', 'Complete Case Details');
      }
      this.hideModals();

    })
  }

  editParty() {
    this.loadingMessage = 'saving party...';
    this.loadingCase = true;

    // CREATE LOCAL PARTY
    let party: Party = this.selectedCaseParty.caseParty;
    party.dob = party.dob ? this.datePipe.transform(party.dob, "MM/dd/yyyy") : "";

    // SAVE THE PARTY
    this.partySvc.saveParty(party).subscribe(result => {

      this.loadingCase = false;
      this.toastSvc.showSuccessMessage('Party saved');

      // CREATE LOCAL CASE PARTY
      let caseParty: CaseParty = this.selectedCaseParty;
      caseParty.startDate = caseParty.startDate ? this.datePipe.transform(caseParty.startDate, "MM/dd/yyyy") : "";
      caseParty.endDate = caseParty.endDate ? this.datePipe.transform(caseParty.endDate, "MM/dd/yyyy") : "";
      caseParty.caseParty = result;

      // ADD CASE PARTY TO CASE PARTIES
      // let caseParties:CaseParty[] = this.case.caseParties.slice();
      // caseParties.push(caseParty);
      // this.case.caseParties =  caseParties;

      this.saveCase();
      this.hideModals();

    })
  }

  saveCase(shouldShowSuccessMessage: boolean = true) {

    if (this.case.caseWeight == 0) {
      this.toastSvc.showWarnMessage('The Case Weight must be greater than 0', 'Case Weight Needed');
      return;
    }
    if (!this.doesCasePartyContainPetitioner() &&  !this.doesCasePartyContainApplicant()) {
      this.toastSvc.showWarnMessage('The case must have a Petitioner / Applicant Case Party assigned.', 'Applicant/Petitioner Needed');
      return;
    }

    this.loadingMessage = 'saving case...';
    this.loadingCase = true;

    let shouldRefreshURL: boolean = this.case.caseOID == 0;

    this.caseSvc
      .saveCourtCase(this.case)
      .subscribe(c => {
        this.loadingCase = false;
        this.showStaticMessage(false);
        this.case = c;
        if (shouldShowSuccessMessage) {
          this.toastSvc.showSuccessMessage("Case Saved");
        }
        if (shouldRefreshURL) {
          this.router.navigate(['/case-detail', this.case.caseOID])
        }
      },
        (error) => {
          console.log(error);
          this.loadingCase = false;
          this.toastSvc.showErrorMessage('There was an error saving the case.')
        },
        () => {
          this.loadingCase = false;
        });
  }

  doesCasePartyContainChild(): boolean {
    return this.case.caseParties.findIndex(cp => cp.role.casePartyRoleOID == 1) > -1;
  }
  
  doesCasePartyContainApplicant(): boolean {
    return this.case.caseParties.findIndex(cp => cp.role.casePartyRoleOID == 16) > -1;
  }

  doesCasePartyContainPetitioner(): boolean {
    return this.case.caseParties.findIndex(cp => cp.role.casePartyRoleOID == 17) > -1;
  }

  newCPfNameChanged(event) {
    this.newCaseParty.caseParty.firstName = event;
  }

  newCPlNameChanged(event) {
    this.newCaseParty.caseParty.lastName = event;
  }

  newCPlFullNameChanged(event) {
    this.newCaseParty.caseParty.fullName = event;
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

  newCasePartyRoleTypeOnChange(event) {
    console.log(event);
    this.newCaseParty.role = event.value;
  }

  // -------------------------
  //   ADD CASE CHARGE MODAL
  // ------------------------=

  showModalAddCaseCharge: boolean = false;
  showDeleteChargeModal: boolean = false;

  sectionTypes: IccsCode[];        // FetchICCSCategory GET
  selectedSectionType: IccsCode = null;
  divisionTypes: IccsCode[];
  selectedDivisionType: IccsCode = null;
  groupTypes: IccsCode[];
  selectedGroupType: IccsCode = null;
  classTypes: IccsCode[];
  selectedClassType: IccsCode = null;
  chargeLawTypes: any[];
  selectedChargeLawType: any;
  leaLeadChargeText: string;

  chargeFactorTypes: ChargeFactor[];        // FetchChargeFactor GET
  selectedChargeFactors: ChargeFactor[]; 
  filteredChargeFactorTypes: ChargeFactor[];
  lastSelectedTypeLocalCharges: any[] = [];

  //RS Implementing Charge Factor Variables
  chargeFactorVariables: ChargeFactorVariable[];
  selectedChargeFactorVariables: ChargeFactorVariable[];
  filteredChargeFactorVariables: ChargeFactorVariable[];

  chargeFactorCategory: ChargeFactorCategory[]; //Holds values returned from the server
  selectedChargeFactorCategory: ChargeFactorCategory[]; //Holds values selected from the UI
  filteredChargeFactorCategory: ChargeFactorCategory[]; //Holds filtered values based on a selection


  onAddCaseCharge(caseChargeForm) {
    if (!this.case.caseOID || this.case.caseOID == 0) {
      this.toastSvc.showInfoMessage('Please complete case details and Save Case before proceeding.', 'Complete Case Details');
      return;
    }

    this.selectedCharge = new CaseCharge();
    caseChargeForm.reset();
    this.resetIccsCodes();

    this.showModalAddCaseCharge = true;

    this.caseSvc
      .fetchLocalCharge()
      .subscribe(localCharges => this.chargeLawTypes = localCharges);

    this.caseSvc
      .fetchChargeFactor()
      .subscribe(chargeFactors => {
        this.chargeFactorTypes = chargeFactors;
        this.filteredChargeFactorTypes = chargeFactors;
      });


    //RS Implementing Charge Factor Variables in UI
    this.caseSvc
      .fetchChargeFactorVariables()
      .subscribe(chargeFactorVariables => {
        this.chargeFactorVariables = chargeFactorVariables;
        this.filteredChargeFactorVariables = chargeFactorVariables;
      });

      //RS Implementing Charge Factor Category in UI
      this.caseSvc
      .fetchChargeFactorCategory()
      .subscribe(chargeFactorCategory => {
        this.chargeFactorCategory = chargeFactorCategory;
        this.filteredChargeFactorCategory = chargeFactorCategory;
      });  
  }

  resetIccsCodes() {
    this.resetCategories();
    this.selectedChargeLawType = null;

    // keep  -> sectionTypes
    this.divisionTypes = null;
    this.groupTypes = null;
    this.classTypes = null;
    this.chargeLawTypes = null;
  }

  sectionTypeOnChange(event) {
    this.caseSvc
      .fetchICCSCategory(this.selectedSectionType.iccsCodeOID)
      .subscribe(categories => {
        this.divisionTypes = categories;
      });
  }

  divisionTypeOnChange(event) {
    this.chargeLawTypes = this.selectedDivisionType.localCharges;
    this.caseSvc
      .fetchICCSCategory(this.selectedDivisionType.iccsCodeOID)
      .subscribe(categories => {
        this.groupTypes = categories;
      });
  }

  groupTypeOnChange(event) {
    this.chargeLawTypes = this.selectedGroupType.localCharges;
    this.caseSvc
      .fetchICCSCategory(this.selectedGroupType.iccsCodeOID)
      .subscribe(categories => {
        this.classTypes = categories;
      });
  }

  classTypeOnChange(event) {
    this.chargeLawTypes = this.selectedClassType.localCharges;
  }

  chargeLawTypeOnChange(selectedIccsCodeOID: number) {
    if (!this.chargeLawTypes) {
      this.selectedChargeLawType = null;
      return;
    }

    this.selectedChargeLawType = this.chargeLawTypes.find(c => c.localChargeOID == selectedIccsCodeOID);

    this.setCategories(this.selectedChargeLawType);
  }

  public localChargeFilterFunction(filterText: string, options: LocalCharge[]): LocalCharge[] {
    if (!options) {
      return [];
    }

    if (!filterText) {
      return options.copy();
    }

    return options
      .filter(o => {
        let text: string = `${o.categoryIdentifier} ${o.localCharge}`;

        return text.contains(filterText, false);
      });
  }

  public localChargeLabelFunction(localCharge: LocalCharge): string {
    if (!localCharge) {
      return "";
    }

    return `${localCharge.categoryIdentifier} ${localCharge.localCharge}`;
  }

  private resetCategories(): void {
    this.selectedSectionType = null;
    this.selectedDivisionType = null;
    this.selectedGroupType = null;
    this.selectedClassType = null;
  }

  private setCategories(localCharge: LocalCharge) {
    if (!localCharge) {
      this.resetCategories();
      return;
    }

    this.selectedDivisionType = null;
    this.selectedGroupType = null;
    this.selectedClassType = null;

    let parentCode: IccsCode = localCharge.parentICCSCode;

    while (parentCode) {
      this.setCategory(parentCode);
      parentCode = parentCode.parentICCSCode;
    }
  }

  private setCategory(iccsCode: IccsCode): void {
    if (iccsCode.categoryType == IccsCodeCategory.SECTION) {
      this.selectedSectionType = iccsCode;
    } else if (iccsCode.categoryType == IccsCodeCategory.DIVISION) {
      this.selectedDivisionType = iccsCode;
    } else if (iccsCode.categoryType == IccsCodeCategory.GROUP) {
      this.selectedGroupType = iccsCode;
    } else if (iccsCode.categoryType == IccsCodeCategory.CLASS) {
      this.selectedClassType = iccsCode;
    }
  }


  getChargeFactorCategoryToFilter(event) {
    let query = event.query;
    this.filteredChargeFactorCategory = this.filterChargeFactorCategory(query, this.filteredChargeFactorCategory);
  }

  filterChargeFactorCategory(query, chargeFactorCategory: any[]): any[] {
    let filtered: any[] = [];

    for (let i = 0; i < chargeFactorCategory.length; i++) {
     
        filtered.push(chargeFactorCategory[i]);
      
    }
    return filtered;
  }


  getChargeFactorsToFilter(event,selCFC: ChargeFactorCategory) {
    let query = event.query;
    this.filteredChargeFactorTypes = this.filterChargeFactors(query,selCFC,this.chargeFactorTypes);
  }


  filterChargeFactors(query,selcfc: ChargeFactorCategory, cfactors: ChargeFactor[]): any[] {
    

    let filtered: any[] = [];
    let catID: number = selcfc.chargeFactorCategoryId;
    let catCID: number = selcfc.courtOID;
    
    for (let i = 0; i < cfactors.length; i++) {
       
        if (catID === cfactors[i].disaggregationID.valueOf()) {
              
          filtered.push(cfactors[i]);    
        }    
    }

    return filtered;
  }//filtereChargeFactors

  //RS Implementing Charge Factor Variables, the results returned are based on the user's selection of a charge factor
  getChargeFactorsVariablesToFilter(event, selCF: ChargeFactor) {
    let query = event.query;
    this.filteredChargeFactorVariables = this.filterChargeFactorVariables(query,selCF,this.chargeFactorVariables);
  }

  filterChargeFactorVariables(query, selcf: ChargeFactor, cfVariables: ChargeFactorVariable[]): any[] {

    let i:number = 0;
    let filtered: any[] = [];
    
    for (i = 0; i < cfVariables.length; i++) {
       
        if (selcf.name === cfVariables[i].chargeFactorName) {
              
          filtered.push(cfVariables[i]);    
      }
    }
    return filtered;
  }

  //RS Implementing Charge Factor Variables*/


  saveCaseCharge() {
    let charge: CaseCharge;

    if (this.selectedCharge) {
      charge = this.selectedCharge;
    } 
    else {
      charge = new CaseCharge();
    }

    let iccsCode: IccsCode = this.setIccsCodes();

    // CHECK FOR DUPLICATE CHARGE
    if (this.checkForDupCharge(iccsCode)) {
      this.toastSvc.showWarnMessage('Duplicate charges are not permitted.', 'Duplicate Charge')
      return;
    }

    charge.caseOID = this.case.caseOID;
    charge.courtOID = this.case.court.courtOID;
    charge.iccsCode = iccsCode;

    charge.chargeFactorCategory = this.selectedChargeFactorCategory;
    charge.chargeFactors = this.selectedChargeFactors;
    charge.chargeFactorVariables = this.selectedChargeFactorVariables;
    

    if (iccsCode) {
      charge.iccsChargeCategoryOID = iccsCode.iccsCodeOID;
    }

    charge.leaChargingDetails = this.leaLeadChargeText;
    charge.localCharge = this.selectedChargeLawType;

    if (!charge.caseChargeOID) {
      this.case.caseCharges.push(charge);
    }

    this.case.caseCharges = this.case.caseCharges.slice();

    this.hideModals();
    this.showStaticMessage(true, 'warn', 'Click "Save Case" to save Charges to the Case.', 'Unsaved Values');
  }

  private setIccsCodes(): IccsCode {
    if (this.selectedClassType) {
      return this.selectedClassType;
    }

    if (this.selectedGroupType) {
      return this.selectedGroupType;
    }

    if (this.selectedDivisionType) {
      return this.selectedDivisionType;
    }

    if (this.selectedSectionType) {
      return this.selectedSectionType;
    }

    return null;
  }

  checkForDupCharge(iccsCode) {
    let charges: CaseCharge[] = this.case.caseCharges;
    let idx: number = charges.findIndex(c => ObjectUtils.areObjectsEqualDeep(c.iccsCode, iccsCode));
    return idx > -1;
  }

  requestDeleteCharge(charge: CaseCharge): void {
    this.selectedCharge = charge;
    this.showDeleteChargeModal = true;
  }

  deleteCharge(): void {
    CollectionUtil.removeArrayItem(this.case.caseCharges, this.selectedCharge);
    this.case.caseCharges = this.case.caseCharges.slice();
    this.showDeleteChargeModal = false;
    this.saveCase(false);
  }

  addChargeFactorDetails() {
    /*let authCourtsLen = this.user.authorizedCourts.push(new AuthorizedCourt());
    this.user.authorizedCourts[authCourtsLen - 1].roles.push(new Role());
    this.selectedAuthCourt = this.user.authorizedCourts[authCourtsLen - 1];*/
    // console.log('this.user.authorizedCourts', this.user.authorizedCourts);
  }



  // ------------------------------------------------
  //   ADD CASE TASK MODAL
  // -----------------------------------------------=

  selectedCaseTask: CaseTask;
  
  showModalAddCaseTask: boolean = false;
  task: any = {};
  taskTypes: TaskType[];


  public caseTaskPriorityTypes: SelectItem[] = [
    { value: 0, label: 'N/A' },
    { value: 1, label: 'Urgent' },
    { value: 2, label: 'High' },
    { value: 3, label: 'Normal' }
  ];

  public caseTaskCheckOutStatus: SelectItem[] = [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' }
  ];
  
  taskParties: Party[];
  staffPools: Pool[];
  loadingCaseTaskLookups: boolean = false;

  getPriorityValue(val): any {
    return this.caseTaskPriorityTypes[val].label;
  }

  getTaskCheckoutValue(val): any {
      return this.caseTaskCheckOutStatus[val].label;
  }

  createCaseTask(taskTypeId?) {
    this.selectedCaseTask = new CaseTask();
    this.onShowCaseTaskModal(taskTypeId);
    
  }

  taskOnRowSelect(event) {
    if (!this.hasPermission(this.Permission.UPDATE_TASK)) return false;
    this.selectedCaseTask = event.data;
    if (this.selectedCaseTask.taskDoneDate != null) this.selectedCaseTask.taskCompleted = true;
    this.onShowCaseTaskModal();
    if(event.data.taskCheckedOutBy == 1) this.selectedCaseTask.taskCheckedOut = true;
  }

  
  onShowCaseTaskModal(taskTypeId?) {
    this.showModalAddCaseTask = true;
    if (this.caseTaskSubscription) {
      this.initCaseTaskModal(taskTypeId);
      return;
    }
    
    this.loadingCaseTaskLookups = true;
    var source = Observable.forkJoin<any>(
      //RS: This no longer needed since we are only assigning tasks to pools
      // It significantly reduces the load time of this module
      //this.partySvc.fetchAny({ courtUser: "true" }), 
      this.lookupSvc.fetchLookup<TaskType>('FetchTaskType'),
      this.lookupSvc.fetchLookup<Pool>('FetchStaffPool')
    );
    this.caseTaskSubscription = source.subscribe(
      results => {
        //this.taskParties = results[0] as Party[];
        this.taskTypes = results[0] as TaskType[];
        this.staffPools = results[1] as Pool[];

        this.initCaseTaskModal(taskTypeId);
      },
      (error) => {
        console.log(error);
        this.loadingCaseTaskLookups = false;
        this.toastSvc.showErrorMessage('There was an error fetching task reference data.')
      },
      () => {
        this.loadingCaseTaskLookups = false;
      });
  }

  //This populates all the existing fields for Add Case Task Module
  initCaseTaskModal(taskTypeId?) {

    this.loadingCaseTaskLookups = false;
    if (taskTypeId) {
      this.selectedCaseTask.taskType = this.taskTypes.find((task) => task.taskTypeOID == taskTypeId);
    }

    //if (this.selectedCaseTask.assignedParty) {
    //  this.selectedCaseTask.assignedParty = this.taskParties.find(p => p.partyOID == this.selectedCaseTask.assignedParty.partyOID);
    //}

    if (this.selectedCaseTask.assignedPool) {
      this.selectedCaseTask.assignedPool = this.staffPools.find(s => s.poolOID == this.selectedCaseTask.assignedPool.poolOID);
    }

    //This stores the actual completion date from the DB.
    //Used in the event a user cancels their entry of a completion date.
    this.actualCompletionDate = this.selectedCaseTask.taskDoneDate;

    for (let i = 0; i < this.case.caseTasks.length; i++){
     
      this.case.caseTasks[i].taskPriorityDesc = this.priorityCodeDesc(this.case.caseTasks[i].taskPriorityCode);
          
    }

  }



  onCancelCaseTask(form) {
    //This would not overwrite the actual cast task:completion date with incorrect display data
    if(this.actualCompletionDate == null) this.selectedCaseTask.taskDoneDate = null;
    this.hideModals();
    // form.reset();  // this is deleting the selectedItem from the grid!!??~
    this.selectedCaseTask = null;

  }

  onCancelCasePayment() {
    this.hideModals();
    //form.reset();  // this is deleting the selectedItem from the grid!!??~
    this.selectedCasePayment = null;
  }  

  taskdocumentSelectedOnChange(event){
    this.selectedCaseTask.taskDocumentTemplateOID = event.value.documentTemplateOID;
  }


  taskCompletedOnChange(event){
    this.selectedCaseTask.taskCompleted = event;
    if(this.selectedCaseTask.taskCompleted)
      this.toastSvc.showInfoMessage('You have marked this task as completed. Please ensure all the relavent information is completed before saving this task');      
  }

  //This records if task was checked out or not
  taskCheckedOutOnChange(event){
    this.selectedCaseTask.taskCheckedOut = event;   
  }
  
  documentSelected(event: any): void {
    
    this.selectedCaseTask.docTemplate = event;
  }

  saveCaseTask() {

    if (!this.selectedCaseTask.assignedPool && !this.selectedCaseTask.assignedParty) {
      this.toastSvc.showWarnMessage('Task must be assigned to Staff, Pool or both.', 'Not Assigned');
      return;
    }

    //This converts all parameters to string form to be sent to the server
    let task = new CaseTaskDTO(); 
    if (this.selectedCaseTask.taskOID) task.taskOID = this.selectedCaseTask.taskOID.toString();
    task.caseOID = this.case.caseOID.toString();
    task.taskDetails = this.selectedCaseTask.taskDetails.toString();
    task.taskPriorityCode = this.selectedCaseTask.taskPriorityCode.toString();
    task.taskParty = this.selectedCaseTask.assignedParty ? this.selectedCaseTask.assignedParty.partyOID.toString() : null;
    task.taskStaffPool = this.selectedCaseTask.assignedPool ? this.selectedCaseTask.assignedPool.poolOID.toString() : null;
    task.taskType = this.selectedCaseTask.taskType.taskTypeOID.toString();
    task.taskDocumentTemplateOID = this.selectedCaseTask.taskDocumentTemplateOID.toString();    
    task.taskDueDate = this.datePipe.transform(this.selectedCaseTask.taskDueDate, "yyyy-MM-dd HH:mm"); // taskDueDate:"2018-01-31"

    
    if (this.selectedCaseTask.taskCompleted) {
      task.taskCompleted = 'true';
      //this.toastSvc.showInfoMessage('You have marked this task as completed. Please ensure all relavent information is completed before saving this task');
    }
    else task.taskCompleted = 'false';


    if (this.selectedCaseTask.taskCheckedOut) task.taskCheckedOut = 'true';
      else task.taskCheckedOut = 'false';
    

    this.caseSvc.saveCaseTask(task).subscribe(result => {
      let savedTask = result[0];

      if (this.selectedCaseTask.assignedParty)
        Object.assign(this.selectedCaseTask.assignedParty, savedTask.assignedParty);

      if (this.selectedCaseTask.assignedPool)
        Object.assign(this.selectedCaseTask.assignedPool, savedTask.assignedPool);

      
      if (this.selectedCaseTask.assignedDate)
        Object.assign(this.selectedCaseTask.assignedDate, savedTask.assignedDate);   

      let task = this.selectedCaseTask;

      // see if item exists in list
      let idx = this.case.caseTasks.findIndex(item => item.taskOID == task.taskOID);

      if (idx > -1) this.case.caseTasks[idx] = task;
     
      else {
        this.case.caseTasks.push(task);
        this.case.caseTasks = this.case.caseTasks.slice();
        
      }
     
      // Refresh the grid --------
      // this.case.caseTasks = this.case.caseTasks.slice();

      this.toastSvc.showSuccessMessage('Your case task has been saved.', 'Task Saved');
      this.saveCase();
      this.hideModals();
      this.selectedCaseTask = null;
    });
  }
 
  taskTypeOnChange(event) {
    this.selectedCaseTask.taskType = event.value;
  }

  priorityTypeOnChange(event) {
    this.selectedCaseTask.taskPriorityCode = event.value;
    
  }

  assignedPersonTypeOnChange(event) {
    this.selectedCaseTask.assignedParty = this.taskParties.find(item => item.partyOID == event.value);
  }

  staffPoolTypeOnChange(event) {
    this.selectedCaseTask.assignedPool = event.value;
  }

  dueDateOnChange(event) {
    this.selectedCaseTask.taskDueDate = event;
  }

  dateOfPaymentOnChange(event) {
    this.selectedCasePayment.dateOfPayment = event;
  }

  dateOfDisbursementOnChange(event) {
    this.selectedCasePayment.disbursementDate = event;
    if(this.selectedCasePayment.paymentDisbursedFlag != true) this.disbursementToggle = false;
  }  

  periodStartDateOnChange(event,acIdx) {

    console.log('paymentPeriodStartDate',event);
    console.log('paymentPeriodStartDate Location',acIdx);

    this.selectedCasePayment.paymentsDisbursements[acIdx].paymentPeriodStartDate = event;
  }

  periodEndDateOnChange(event,acIdx) {
    //need to track the array to adjust the values
    this.selectedCasePayment.paymentsDisbursements[acIdx].paymentPeriodEndDate = event;
  }

  taskDetailsOnChange(event) {
    this.selectedCaseTask.taskDetails = event;
  }


  // ------------------------------------------------
  //   ADD CASE PAYMENT MODAL
  // -----------------------------------------------=
  showModalAddCasePayment: boolean = false;
  //selectedCasePayment: CasePayment;

  paymentOnRowSelect(event) {
    /*if (!this.hasPermission(this.Permission.UPDATE_TASK)) return false;
    this.selectedCaseTask = event.data;
    if (this.selectedCaseTask.taskDoneDate != null) this.selectedCaseTask.taskCompleted = true;
    this.ShowAddCasePayment();
    if(event.data.taskCheckedOutBy == 1) this.selectedCaseTask.taskCheckedOut = true;*/
  }






  // -------------------------
  //   ADD JUDGE MODAL
  // ------------------------=

  showModalAddJudge: boolean = false;
  judges: JudicialOfficer[];
  judge: JudicialAssignment = new JudicialAssignment();
  loadingJudgeLookups: boolean = false;


  // Handles a row click
  judicialAssignmentOnRowSelect(event) {

    if (!this.hasPermission(this.Permission.UPDATE_JUDICIAL_ASSIGNMENT)) return false;
    this.onShowJudgeModal();
    this.judge = event.data;
  }

  // Handles Magnify/View Icon click
  requestViewJudicialAssignment(judge): void {
    this.judge = judge;
    this.onShowJudgeModal();
  }

  // Handles Add Judge button click
  onAddJudge() {
    this.judge = new JudicialAssignment();
    this.onShowJudgeModal();
  }

  onShowJudgeModal() {
    this.showModalAddJudge = true;
    this.loadingJudgeLookups = true;

    this.caseSvc
      .getJudicialOfficers()
      .subscribe(judges => {
        this.loadingJudgeLookups = false;
        this.judges = judges;

        // Pre-set the dropdown
        if (this.judge.judicialOfficial) {
          this.judge.judicialOfficial = judges
            .find(j => j.partyOID == this.judge.judicialOfficial.partyOID);
        }
      },
        (error) => {
          console.log(error);
          this.loadingJudgeLookups = false;
          this.toastSvc.showErrorMessage('There was an error fetching judicial data.')
        },
        () => {
          this.loadingJudgeLookups = false;
        });

        console.log('List of Judges returned are', this.judges);
  }

  saveJudge() {

    // If this a new Judicical Assignment
    if (!this.judge.judicialAssignmentOID || this.judge.judicialAssignmentOID == 0) {
      // Check for duplicate
      let isJudgeOnCase = this.case.judicialAssignments
        .findIndex(item => item.judicialOfficial.partyOID == this.judge.judicialOfficial.partyOID) > -1;
      if (isJudgeOnCase) {
        this.toastSvc.showWarnMessage('A judge can only be added to the case once.', 'Duplicate Judge');
        return;
      }
    }

    this.judge.caseOID = this.case.caseOID;

    this.caseSvc
      .saveJudicialAssignment(this.judge)
      .subscribe(assignment => {
        let index: number = this.case.judicialAssignments
          .findIndex(a => a.judicialAssignmentOID == assignment.judicialAssignmentOID);

        if (index >= 0) {
          this.case.judicialAssignments[index] = assignment;
        } else {
          this.case.judicialAssignments.push(assignment);
          this.case.judicialAssignments = this.case.judicialAssignments.slice();
        }

        this.toastSvc.showSuccessMessage('Judge Saved');

      });

    this.showModalAddJudge = false;
  }


  // -------------------------
  //   ADD COMPLETED EVENT MODAL
  //   (in Register tab)
  // ------------------------=

  showModalAddEvent: boolean = false;
  events: any[];
  filteredEvents: CaseEvent[] = [];
  caseEvent: CaseEvent = new CaseEvent();
  eventTypes: EventType[]; // verify correct data type
  eventParties: Party[];   // verify correct data type
  documents: any[];
  selectedInitiatedByParty: CaseParty;
  eventTypeFilter: EventType = null;

  eventTypeFilterChange(event): void {
    this.filterCaseEvents();
  }

  clearEventFilter(): void {
    this.eventTypeFilter = null;
    this.filterCaseEvents();
  }

  caseEventOnRowSelect(event): void {
    this.caseEvent = event.data;
    this.showModalAddEvent = true;
  }

  requestViewCaseEvent() {
    this.showEventModal();
  }

  addCaseEventClicked() {
    this.caseEvent = new CaseEvent();

    this.showEventModal();
  }

  showEventModal() {
    this.showModalAddEvent = true;

    if (this.caseEvent.initiatedByParty) {
      this.selectedInitiatedByParty = this.case.caseParties
        .find(cp => cp.caseParty.partyOID == this.caseEvent.initiatedByParty.partyOID);
    } else {
      this.selectedInitiatedByParty = null;
    }

    this.caseEvent.caseOID = this.case.caseOID;
  }

  saveEvent() {
    console.log('this.caseEvent.caseEventOID BEFORE SAVE', this.caseEvent.caseEventOID)
    this.caseEvent.initiatedByParty = this.selectedInitiatedByParty && this.selectedInitiatedByParty.caseParty ? this.selectedInitiatedByParty.caseParty : null;

    this.caseSvc
      .saveCaseEvent(this.caseEvent)
      .subscribe(savedCaseEvent => {
        console.log('savedCaseEvent.caseEventOID AFTER SAVE', savedCaseEvent.caseEventOID)
        savedCaseEvent.eventType = this.eventTypes.find(e => e.eventTypeOID == savedCaseEvent.eventType.eventTypeOID);

        let index: number = this.case.caseEvents
          .findIndex(ce => ce.caseEventOID == savedCaseEvent.caseEventOID);

        if (index >= 0) {
          this.case.caseEvents[index] = savedCaseEvent;
        } else {
          this.case.caseEvents.push(savedCaseEvent);
          this.case.caseEvents = this.case.caseEvents.slice();
        }
        this.filterCaseEvents();
      });

    this.showModalAddEvent = false;
  }

  filterCaseEvents(): void {
    if (this.eventTypeFilter && this.case.caseEvents) {
      this.filteredEvents = this.case.caseEvents
        .filter(e => e.eventType.eventTypeOID == this.eventTypeFilter.eventTypeOID);
    } else {
      this.filteredEvents = this.case.caseEvents;
    }
  }

  // -------------------------
  //   DOCUMENTS TAB
  //
  // ------------------------=
  uploadedFiles: any[] = [];

  generateDoc(): void {
    this.caseSvc
      .downloadCourtDocument(this.case.caseOID, this.selectedDocumentTemplateType.documentTemplateOID)
      .subscribe();
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.toastSvc.showSuccessMessage('File Uploaded');
  }

  onBeforeSendFile(event) {
    event.xhr.setRequestHeader("caseOID", this.case.caseOID);
    event.xhr.setRequestHeader("Authorization", "Bearer " + this.authToken);
    event.xhr.setRequestHeader("token", this.authToken);
  }

  ddOnChange(event): void {
  }

  ddOnChangeSubType(event): void {
  }

}
