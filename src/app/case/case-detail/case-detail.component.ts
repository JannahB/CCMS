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
import { CaseStatus } from '../../common/entities/CaseStatus';
import { CasePhase } from '../../common/entities/CasePhase';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../common/services/utility/local-storage.service';
import { DateUtils } from '../../common/utils/date-utils';
import { UserService } from '../../common/services/utility/user.service';
import { Permission } from '../../common/entities/Permission';
import { LocalCharge } from '../../common/entities/LocalCharge';
import { IccsCodeCategory } from '../../common/entities/IccsCodeCategory';

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
  selectedCharge: CaseCharge;
  selectedParty: Party;
  selectedDoc: CaseDocument;
  selectedEvent: CaseEvent;
  selectedJudicialAssignment: any;
  documentTemplateTypes: DocTemplate[] = [];
  selectedDocumentTemplateType: DocTemplate;
  routeSubscription: Subscription;
  caseTypes: CaseType[] = [];
  caseStatuses: CaseStatus[] = [];
  casePhases: CasePhase[] = [];
  baseURL: string;
  selectedChargeLawTypeId: any;
  datePipe: DatePipe = new DatePipe("en");
  actualCompletionDate: Date = null; //Used to capture the actual cask task completion date from the DB.

  //Rhea Seegobin
  selChargeFactor: string = ""; 
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
    if (this.caseTaskSubscription) this.caseTaskSubscription.unsubscribe();
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
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
        console.log(kase);
        // Remove all files with a '^' in the docName - they are orphans
        this.case.caseDocs = this.case.caseDocs.filter(cd => {
          return cd.documentName.indexOf('^') == -1;
        })

        if (this.case.caseType) {
          this.caseSvc
            .fetchPhaseByType(this.case.caseType.caseTypeOID)
            .subscribe(results => this.casePhases = results);
        }

        if (this.case.caseParties.length > 0) {
          this.case.caseParties.map(cp => {
            cp.caseParty.age = this.calculateAge(cp.caseParty.dob);
          })
        }

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
      this.caseSvc
        .fetchPhaseByType(this.case.caseType.caseTypeOID)
        .subscribe(results => this.casePhases = results);
    } else {
      this.casePhases = [];
    }
  }

  isCaseTypeSelected($event) {
    if (!this.case.caseType)
      this.toastSvc.showWarnMessage('Please choose Case Type first')
  }


  // MODALS --------------------------------------------

  hideModals() {
    this.showModalAddCaseCharge = false;
    this.showModalAddCaseParty = false;
    this.showModalAddCaseTask = false;
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
  casePartyRoleTypes: CasePartyRole[];
  selectedSearchParty: Party;
  selectedSearchPartyRole: CasePartyRole = null;
  selectedSearchPartyStartDate: Date;
  selectedSearchPartyEndDate: Date = null;
  selectedCaseParty: CaseParty = null;
  newCaseParty: CaseParty = new CaseParty();
  genderTypes: any = [{ label: 'M', value: 'M' }, { label: 'F', value: 'F' },];

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

    this.caseSvc
      .fetchCasePartyRole()
      .subscribe(roles => this.casePartyRoleTypes = roles);
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
    if (!this.doesCasePartyContainChild()) {
      this.toastSvc.showWarnMessage('The case must have at least one Child Case Party assigned.', 'Child Needed');
      return;
    }

    /*Rhea Seegobin: Insert Dummy data for the charge factor details
    
    this.case.caseCharges[0].chargeFactorCategory[0] = 1;
    this.case.caseCharges[0].chargeFactorCategory[0].courtOID = 5;
    this.case.caseCharges[0].chargeFactorCategory[0].chargeFactorCategoryDesc = "Event Disaggregation";
    
    this.case.caseCharges[0].chargeFactors[0].chargeFactorOID = 1;
    this.case.caseCharges[0].chargeFactors[0].courtOID = 5;
    this.case.caseCharges[0].chargeFactors[0].name = "We";
    this.case.caseCharges[0].chargeFactors[0].description = "Type of Weapon Used";
    this.case.caseCharges[0].chargeFactors[0].disaggregationID = 1;

    this.case.caseCharges[0].chargeFactorVariables[0].chargeFactorVariableID = 1;
    this.case.caseCharges[0].chargeFactorVariables[0].chargeFactorName = "We";
    this.case.caseCharges[0].chargeFactorVariables[0].chargeFactorVariableDescription = "Firearm";
    this.case.caseCharges[0].chargeFactorVariables[0].courtID = 5;
    //Rhea Seegobin: Insert Dummy data for the charge factor details*/



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
  priorityTypes: SelectItem[] = [
    { value: 0, label: 'N/A' },
    { value: 1, label: 'Urgent' },
    { value: 2, label: 'High' },
    { value: 3, label: 'Normal' }
  ];
  taskParties: Party[];
  staffPools: Pool[];
  loadingCaseTaskLookups: boolean = false;

  createCaseTask(taskTypeId?) {
    this.selectedCaseTask = new CaseTask();
    this.onShowCaseTaskModal(taskTypeId);
  }

  taskOnRowSelect(event) {
    if (!this.hasPermission(this.Permission.UPDATE_TASK)) return false;
    this.selectedCaseTask = event.data;
    this.onShowCaseTaskModal();
    console.log('taskOnRowSelect selected case task', this.selectedCaseTask)
  }

  onShowCaseTaskModal(taskTypeId?) {
    this.showModalAddCaseTask = true;
    if (this.caseTaskSubscription) {
      this.initCaseTaskModal(taskTypeId);
      return;
    }
    
    this.loadingCaseTaskLookups = true;
    var source = Observable.forkJoin<any>(
      this.partySvc.fetchAny({ courtUser: "true" }),
      this.lookupSvc.fetchLookup<TaskType>('FetchTaskType'),
      this.lookupSvc.fetchLookup<Pool>('FetchStaffPool')
    );
    this.caseTaskSubscription = source.subscribe(
      results => {
        this.taskParties = results[0] as Party[];
        this.taskTypes = results[1] as TaskType[];
        this.staffPools = results[2] as Pool[];

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

  initCaseTaskModal(taskTypeId?) {

    this.loadingCaseTaskLookups = false;
    if (taskTypeId) {
      this.selectedCaseTask.taskType = this.taskTypes.find((task) => task.taskTypeOID == taskTypeId);
    }

    if (this.selectedCaseTask.assignedParty) {
      this.selectedCaseTask.assignedParty = this.taskParties.find(p => p.partyOID == this.selectedCaseTask.assignedParty.partyOID);
    }

    if (this.selectedCaseTask.assignedPool) {
      this.selectedCaseTask.assignedPool = this.staffPools.find(s => s.poolOID == this.selectedCaseTask.assignedPool.poolOID);
    }

    //This stores the actual completion date from the DB.
    //Used in the event a user cancels their entry of a completion date.
    this.actualCompletionDate = this.selectedCaseTask.doneDate;

  }

  onCancelCaseTask(form) {

    //This would not overwrite the actual cast task:completion date with incorrect display data
    if(this.actualCompletionDate == null) this.selectedCaseTask.doneDate = null;
    this.hideModals();
    // form.reset();  // this is deleting the selectedItem from the grid!!??~
    this.selectedCaseTask = null;
  }

  documentSelected(event: any): void {
    console.log('documentSelected event', event);
    this.selectedCaseTask.docTemplate = event;
  }

  saveCaseTask() {

    if (!this.selectedCaseTask.assignedPool && !this.selectedCaseTask.assignedParty) {
      this.toastSvc.showWarnMessage('Task must be assigned to Staff, Pool or both.', 'Not Assigned');
      return;
    }

    let task = new CaseTaskDTO();
    if (this.selectedCaseTask.taskOID) task.taskOID = this.selectedCaseTask.taskOID.toString();
    task.caseOID = this.case.caseOID.toString();
    task.taskDetails = this.selectedCaseTask.details;
    task.taskPriorityCode = this.selectedCaseTask.taskPriorityCode.toString();
    task.taskParty = this.selectedCaseTask.assignedParty ? this.selectedCaseTask.assignedParty.partyOID.toString() : null;
    task.taskStaffPool = this.selectedCaseTask.assignedPool ? this.selectedCaseTask.assignedPool.poolOID.toString() : null;
    task.taskType = this.selectedCaseTask.taskType.taskTypeOID.toString();
    task.taskDueDate = this.datePipe.transform(this.selectedCaseTask.dueDate, "yyyy-MM-dd"); // taskDueDate:"2018-01-31"
    if (this.selectedCaseTask.doneDate)
      task.doneDate = this.datePipe.transform(this.selectedCaseTask.doneDate, "yyyy-MM-dd"); // taskDueDate:"2018-01-31"


    this.caseSvc.saveCaseTask(task).subscribe(result => {
      let savedTask = result[0];

      if (this.selectedCaseTask.assignedParty)
        Object.assign(this.selectedCaseTask.assignedParty, savedTask.assignedParty);

      if (this.selectedCaseTask.assignedPool)
        Object.assign(this.selectedCaseTask.assignedPool, savedTask.assignedPool);

      this.selectedCaseTask.taskOID = savedTask.taskOID;

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
    this.selectedCaseTask.dueDate = event;
  }

  doneDateOnChange(event) {
    this.selectedCaseTask.doneDate = event;
  }

  taskDetailsOnChange(event) {
    this.selectedCaseTask.details = event;
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

}
