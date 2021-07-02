import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
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
import { ResponseObject } from "../../common/entities/ResponseObject";
import { PaymentDisbursementDetails } from '../../common/entities/PaymentDisbursementDetails';
import { CasePayment } from '../../common/entities/CasePayment';
import { CaseApplicationType } from '../../common/entities/CaseApplicationType';
import { CountriesService } from '../../common/services/http/countries.service';
import { DocumentType } from '../../common/entities/DocumentType';
import { DropdownDataTransformService } from '../../common/services/utility/dropdown-data-transform.service';
import { AuthorizedCourt } from "../../common/entities/AuthorizedCourt";
import { AppStateService } from "../../common/services/state/app.state.sevice";
import { isNumber } from 'util';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { SentencingType } from '../../common/entities/SentencingType';
import { SentencingService } from '../../common/services/http/sentencing.service';
import {CriminalCharge} from '../../common/entities/CriminalCharge';
import { SelectItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { TrafficCharge } from "../../common/entities/TrafficCharge";
import { CaseTrafficCharge } from "../../common/entities/CaseTrafficCharge";
import { NgForm } from '@angular/forms';
import { RegisterEntry } from "../../common/entities/RegisterEntry";
import { CaseRegisterService } from "../../common/services/http/case-register.service";
import { Console } from 'console';

@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html',
  styleUrls: ['./case-detail.component.scss']
})

export class CaseDetailComponent implements OnInit, OnDestroy{


  @ViewChild('caseForm') caseForm: any;
  @ViewChild("caseTrafficChargeForm") caseTrafficChargeForm: NgForm;
  @Input() filteredCaseEvents: CaseEvent[];
  @Output() filteredEventsChange = new EventEmitter<CaseEvent[]>();

  authToken: string;
  activeTabIndex = 1;
  case: Case;
  caseSubscription: Subscription;
  caseTaskSubscription: Subscription;
  caseWeightRanges: number[] = [1, 10];
  loadingCase = false;
  chargeDescription: string;
  docType: string;
  showAddConsequenceModal: boolean = false;
  loadingMessage = 'loading case...';
  showLoadingBar = false;
  selectedCharge: CaseCharge;
  selectedParty: Party;
  selectedDoc: CaseDocument;
  selectedEvent: CaseEvent;
  selectedJudicialAssignment: any;
  documentTemplateTypes: DocTemplate[] = [];
  selectedDocumentTemplateType: DocumentType;
  routeSubscription: Subscription;
  caseTypes: CaseType[] = [];
  caseApplicationTypes: CaseApplicationType[] = [];
  paymentItems: SelectItem[] = [];
  timeFrequencies: SelectItem[] = [];
  caseDispositionTypes: CaseDispositionType[] = [];
  caseStatuses: CaseStatus[] = [];
  casePhases: CasePhase[] = [];
  caseSubTypes: CaseSubType[] = [];
  criminalConsequences:  any[] = [];
  docTypes: any [] = [];
  selectedCriminalCharge: any;
  selectedConsequence: any;
  chargeDetails: any;
  showField: boolean;
  sentencingTypes: SentencingType[] = [];
  baseURL: string;
  sentencingDocuments: any [] = [];
  dynamicField: any = {'name': null, 'type': null};
  selectedChargeLawTypeId: any;
  appCaseParties: Party[] = [];
  paymentCaseParties: Party[] = [];
  datePipe: DatePipe = new DatePipe("en");
  actualCompletionDate: Date = null;
  selChargeFactor = "";
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
  selectedCaseApplicant: CaseApplicant = new CaseApplicant();
  selectedCourt: AuthorizedCourt;
  loggedInUser: Party;
  courts: AuthorizedCourt[];
  trafficSubscription: Subscription;
  trafficCharges: TrafficCharge[];
  selectedCaseTrafficCharge = new CaseTrafficCharge();
  caseTrafficCharges: CaseTrafficCharge[];
  allCaseTrafficCharges: CaseTrafficCharge[];
  isTraffic = false;
  isEdit = false;
  showModalAddTrafficCaseCharge = false;
  selectedTrafficCharge: TrafficCharge;
  selectedCTCBak: CaseTrafficCharge;
  selectedCTCIdx: Number;
  preventNavToCase = false;
  msgs: Message[] = [];
  showDeleteTrafficChargeConfirmation = false;
  initDocTypeTemp: DocumentType = new DocumentType();


  initDocumentTypes: DocumentType[] = [];
  initDocType: DocumentType = new DocumentType();

  // Doc by Category for drilldown
  docTypesCategories: DocumentType[] = [];

  // multipurpose all types
  allTypesFull: DocumentType[] = [];

  // court docs all
  courtDocs: DocumentType[] = [];

  caseNumberText: String;


  // Doc by Category for filter
  docTypesFilter: DocumentType[] = [];
  // selected filter
  filterDT: DocumentType;
  // filtered case docs
  filterDocs: CaseDocument[];
  // filterDocsBak:CaseDocument[];
  dtFilterText = "";

  selCatDT: DocumentType;
  selDocTypeUpload: DocumentType;

  docTypesShown: DocumentType[] = [];
  docTypeNames: String[] = [];

  //actualCompletionDate: Date = null; //Used to capture the actual cask task completion date from the DB.
  //selChargeFactor: string = "";
  isRegistrar: boolean = false;
  isSentencingUser: boolean = false;
  isUturnUser: boolean = false;


  sealIndicator: number = 0; //
  courtUsers: Party[] = [];
  authUsers: Party[] = [];

  selectedCourtJD: string;
  docTypeFilter: number = 1;

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
    private sentencingSvc: SentencingService,
    private userSvc: UserService,
    private appState: AppStateService,
    private countriesSvc: CountriesService,
    private dropdownSvc: DropdownDataTransformService,
    private caseRegSvc: CaseRegisterService
  ) {

    this.sentencingTypes = [{
      type: 'criminal-charges', description: 'Police Charge', chargeDescription: 'Police Charge'
    },
    {
      type: 'criminal-charges', description: 'Prosecutor Charge', chargeDescription: 'Prosecutor Charge'
    },
    {
      type: 'criminal-charges', description: 'Police Charge', chargeDescription: 'Police Charge'
    },
    {
      type: 'criminal-charge-modifications', description: 'Criminal Charge Modification', chargeDescription: 'Criminal Charge Modification'
    },
    {
      type: 'criminal-sentences', description: 'Sentence Order', chargeDescription: 'Sentence Order'
    },
    {
      type: 'criminal-sentences', description: 'Sentence Order Modification', chargeDescription: 'Sentence Order Modification'
    },
    {
      type: 'sentence-performed', description: 'Compliance', chargeDescription: 'Compliance'
    },
    {
      type: 'payment-records', description: 'Payment Record', chargeDescription: 'Payment Record'
    },
    {
      type: 'bail-bond-records', description: 'Bail Bond Record', chargeDescription: 'Bail Bond Record'
    },
    {
      type: 'criminal-charges', description: 'Work Service', chargeDescription: 'Criminal Charge'
    }
  ];

    this.breadCrumbSvc.setItems([
      { label: 'Case', routerLink: ['/case-detail'] }
    ]);

    if (localStorageService.hasValue('AUTH_TOKEN')) {
      this.authToken = localStorageService.getValue('AUTH_TOKEN');
    }
  }

  arrToDD(arr: String[]): DocumentType[] {
    const dts: DocumentType[] = [];
    arr.forEach(function (val) {
      const itm: DocumentType = new DocumentType();
      itm.name = val as string;
      dts.push(itm);
    });
    console.log(dts);
    return dts;
  }

  ngOnInit() {

    // console.log("ngOnInit called!");

    const dta: DocumentType = new DocumentType();
    dta.name = "Filings";

    const dtb: DocumentType = new DocumentType();
    dtb.name = "Court Documents";

    this.docTypesCategories.push(dta);
    this.docTypesCategories.push(dtb);

    const dtc: DocumentType = new DocumentType();
    dtc.name = "All";

    this.docTypesFilter.push(dtc);
    this.docTypesFilter.push(dta);
    this.docTypesFilter.push(dtb);


    this.baseURL = environment.apiUrl;
    this.permissionSupervisor = this.userSvc.isSupervisor();

    this.routeSubscription = this.activatedRoute.params.subscribe(params => {
      const caseId = params['caseId'];

      this.initDocType.name = "onload";
      this.getTrafficData(caseId);
      //this.caseTrafficCharges = [];

      this.selectedCourtJD = this.userSvc.appState.selectedCourt.courtJD;

      //The can start filter for High Court documents was changed from 1 to 2
      // This allows the correct set of documents to be displayed for DCs vs HCs
      if (this.selectedCourtJD == 'HC') this.docTypeFilter = 2
      else this.docTypeFilter = 1;


       this.caseSvc.fetchNewDocTypesFull().subscribe(results => {
          this.allTypesFull = results;
          this.initDocumentTypes = results.filter(fDocTypes => {
            return (fDocTypes.can_start === this.docTypeFilter);
          }
        );

        this.caseSvc
          .fetchNewDocTypes("court_docs")
          .subscribe(
            doctypes => {
              this.docTypeNames = doctypes;

            }
          );

        this.courtDocs = this.allTypesFull.filter(cdocs =>
          cdocs.is_court_doc === 1
        );
        // console.log(this.allTypesFull);
        // console.log(this.courtDocs);
        this.getCase(caseId);

        this.sentencingSvc
        .getAllByCaseId(caseId)
        .subscribe(criminalConsequences => this.criminalConsequences = criminalConsequences);
      });

    });

    this.isRegistrar = (this.userSvc.loggedInUser && this.userSvc.isRegistrar());

    this.isUturnUser = (this.userSvc.loggedInUser && (this.userSvc.isUturnUser()));
    this.isSentencingUser = (this.userSvc.loggedInUser && (this.userSvc.isSentencingUser()));


    let caseOID: number = 0;

    this.routeSubscription = this.activatedRoute.params.subscribe(params => {
      const caseId = params['caseId'];
      caseOID = caseId;
      // console.log("From the other side");

      // this.getCase(caseId);
    });

    if(caseOID == 0){
      this.getCaseLookupValues();
    }

    this.setSelectedCourt();

  }

  setSelectedCourt() {

    this.loggedInUser = this.userSvc.loggedInUser;
    this.courts = this.loggedInUser.authorizedCourts;
    this.selectedCourt =
    this.appState.selectedCourt || this.loggedInUser.authorizedCourts[0];
  }

  caseTrafficChargeOnRowSelect(event: { data: CaseTrafficCharge }): void {
    this.selectedCaseTrafficCharge = event.data;
    this.showModalAddTrafficCaseCharge = true;
    this.selectedTrafficCharge = this.selectedCaseTrafficCharge.trafficCharge;
    this.isEdit = true;
    this.caseTrafficChargeForm.form.markAsPristine();
  }


  onAddTrafficCaseCharge(caseTrafficChargeForm: NgForm) {
    if (!this.case.caseOID || this.case.caseOID === 0) {
      this.toastSvc.showInfoMessage(
        "Please complete case details and Save Case before proceeding.",
        "Complete Case Details"
      );
      return;
    }
    this.isEdit = false;
    this.showModalAddTrafficCaseCharge = true;
    this.selectedCaseTrafficCharge = new CaseTrafficCharge();
    this.selectedTrafficCharge = null;
  }

  onCancelMinute(caseTrafficChargeForm: NgForm) {
    if (this.selectedCaseTrafficCharge.id === null) {
      CollectionUtil.removeArrayItem(
        this.caseTrafficCharges,
        this.selectedCaseTrafficCharge
      );
      this.caseTrafficCharges = this.caseTrafficCharges.slice();
    } else {
      this.selectedCaseTrafficCharge = this.selectedCTCBak;
    }
    this.hideModals();
  }


  getTrafficData(caseId: number) {
    const source = Observable.forkJoin<any>(
      this.caseSvc.fetchTrafficCharge(),
      this.caseSvc.fetchCaseTrafficCharge(caseId),
      this.caseSvc.fetchCaseTrafficCharges()
    );
    this.trafficSubscription = source.subscribe(
      results => {
        this.trafficCharges = results[0] as TrafficCharge[];
        this.caseTrafficCharges = results[1] as CaseTrafficCharge[];
        this.allCaseTrafficCharges = results[2] as CaseTrafficCharge[];
        this.getCaseTrafficChargesData();
      },
      error => {
        console.log("get trafficcharges error", error);
        this.toastSvc.showErrorMessage(
          "There was an error fetching traffic data."
        );
      }
    );
  }

  private getCaseTrafficChargesData() {
    this.caseTrafficCharges.forEach(ctc => {
      ctc.trafficCharge = this.trafficCharges.find(
        c => c.id === ctc.trafficChargeId
      );
    });
  }


  public trafficChargeFilterFunction(filterText: string, options: TrafficCharge[]): TrafficCharge[] {

    if (!options) {
      return [];
    }

    if (!filterText) {
      return options.copy();
    }

    return options.filter(o => {
      const text = `${o.description} ${o.regulation}`;

      return text.contains(filterText, false);
    });

  }

  trafficChargeOnChange(selectedTrafficChargeId: number) {
    if (!this.trafficCharges) {
      this.selectedTrafficCharge = null;
      return;
    }

    this.selectedTrafficCharge = this.trafficCharges.find(
      c => c.id === selectedTrafficChargeId
    );

    if (this.checkForDupTrafficCharge(this.selectedTrafficCharge)) {
      this.selectedTrafficCharge = null;
      this.toastSvc.showWarnMessage(
        "A charge can only be added to the case once. ",
        "Duplicate Charge"
      );
    }
  }

  private checkForDupTrafficCharge(trafficCharge: TrafficCharge): Boolean {
    const caseTrafficCharges = this.caseTrafficCharges;
    const idx: number = caseTrafficCharges.findIndex(c =>
      ObjectUtils.areObjectsEqualDeep(c.trafficCharge, trafficCharge)
    );
    return idx > -1;
  }

  private UniqueCitationNumber(citationNumber: string): Boolean {
    if (
      this.allCaseTrafficCharges.find(
        cn => cn.citationNumber === citationNumber
      )
    ) {
      return false;
    }
    return true;
  }

  citationNumberOnChange(citationNumber: string) {
    if (!this.UniqueCitationNumber(citationNumber)) {
      this.selectedCaseTrafficCharge.citationNumber = null;
      this.toastSvc.showWarnMessage(
        "A ticket with this Citation Number has already been entered",
        "Duplicate Citation Number"
      );
    }
  }

  saveCaseTrafficCharge(ctcForm: NgForm) {
    let caseTrafficCharge: CaseTrafficCharge;

    if (this.selectedCaseTrafficCharge) {
      caseTrafficCharge = this.selectedCaseTrafficCharge;
    } else {
      caseTrafficCharge = new CaseTrafficCharge();
    }

    caseTrafficCharge.caseId = this.case.caseOID;
    caseTrafficCharge.trafficChargeId = this.selectedTrafficCharge.id;
    caseTrafficCharge.offenceDatetime = this.selectedCaseTrafficCharge.offenceDatetime;
    caseTrafficCharge.paymentDueDate = this.selectedCaseTrafficCharge.paymentDueDate;
    caseTrafficCharge.deleted = false;

    if (this.isEdit) {
      this.caseTrafficCharges = this.caseTrafficCharges.slice();

      if (ctcForm.form.controls["citationNumber"].dirty) {
        if (this.UniqueCitationNumber(caseTrafficCharge.citationNumber)) {
        } else {
          this.toastSvc.showWarnMessage(
            "A ticket with this Citation Number has already been used. Please enter another. ",
            "Duplicate Citation Number"
          );
          return;
        }
      }

      if (ctcForm.form.controls["ddTrafficChargeLaw"].dirty) {
        if (!this.checkForDupTrafficCharge(this.selectedTrafficCharge)) {
        } else {
          this.toastSvc.showWarnMessage(
            "A charge can only be added to the case once. ",
            "Duplicate Charge"
          );
          return;
        }
      }

      if (
        !ctcForm.form.controls["citationNumber"].dirty &&
        !ctcForm.form.controls["ddTrafficChargeLaw"].dirty
      ) {
        try {
          this.caseSvc.saveCaseTrafficCharge(caseTrafficCharge).subscribe(
            result => {
              this.toastSvc.showSuccessMessage("Traffic Charge Saved");
              console.log(result);
            },
            error => {
              console.log(error);
              this.toastSvc.showErrorMessage(
                "There was an error while saving this traffic charge."
              );
            },
            () => {
              // final
            }
          );
        } catch (error) {
          console.log(error);
          this.toastSvc.showErrorMessage(
            "There was an error while saving this traffic charge."
          );
        }
        this.getCaseTrafficChargesData();
        this.hideModals();
      }
    } else {
      if (!caseTrafficCharge.id) {
        if (!this.checkForDupTrafficCharge(this.selectedTrafficCharge)) {
          if (this.UniqueCitationNumber(caseTrafficCharge.citationNumber)) {
            this.caseTrafficCharges.push(caseTrafficCharge);
            this.caseTrafficCharges = this.caseTrafficCharges.slice();
            try {
              this.caseSvc.saveCaseTrafficCharge(caseTrafficCharge).subscribe(
                result => {
                  this.toastSvc.showSuccessMessage("Traffic Charge Saved");
                  console.log(result);
                },
                error => {
                  console.log(error);
                  this.toastSvc.showErrorMessage(
                    "There was an error while saving this traffic charge."
                  );
                },
                () => {
                  // final
                }
              );
            } catch (error) {
              console.log(error);
              this.toastSvc.showErrorMessage(
                "There was an error while saving this traffic charge."
              );
            }
            this.getCaseTrafficChargesData();
            this.hideModals();
          } else {
            this.toastSvc.showWarnMessage(
              "A ticket with this Citation Number has already been used. Please enter another. ",
              "Duplicate Citation Number"
            );
            return;
          }
        } else {
          this.toastSvc.showWarnMessage(
            "A charge can only be added to the case once. ",
            "Duplicate Charge"
          );
          return;
        }
      }
    }
  }


  confirmDeleteTrafficCharge() {
    this.preventNavToCase = true;
        let caseTrafficCharge = this.selectedCaseTrafficCharge;
        caseTrafficCharge.deleted = true;
        let oldCitationNumber = this.selectedCaseTrafficCharge.citationNumber;
        caseTrafficCharge.citationNumber = this.selectedCaseTrafficCharge.citationNumber + "-del-" + this.selectedCaseTrafficCharge.id;
        //try {
          this.caseSvc.saveCaseTrafficCharge(caseTrafficCharge).subscribe(
            result => {
              this.msgs = [
                {
                  severity: "primary",
                  summary: "Deleted",
                  detail: "Traffic charge deleted successfully"
                }];

              this.preventNavToCase = false;
              this.hideModals();
              this.router.navigate(["/case-detail", this.case.caseOID]);
              this.getTrafficData(this.case.caseOID);
            },
            error => {
              console.log(error);
              this.toastSvc.showErrorMessage(
                "There was an error while deleting this traffic charge."
              );
            },
            () => {
              // final
              // register entry save
              const regEntry: RegisterEntry = new RegisterEntry();

              regEntry.description = "Traffic charge with citation number [" + oldCitationNumber + "] deleted";
              regEntry.caseOID = this.case.caseOID as any as string;
              regEntry.eventTypeName = "UPTD";

              this.caseRegSvc
                .save(regEntry)
                .subscribe(result => {
                  this.updateRegisterEvents();
                },
                  (error) => {
                    console.log(error);
                  },
                  () => {
                    // final
                  });
            }
          );
          //}
        }

  public updateRegisterEvents() {
      const currCaseOID: string = (this.case.caseOID as any) as string;
      console.log(currCaseOID);
      this.caseSvc.fetchOne(currCaseOID).subscribe(
      kase => {
        this.filteredEventsChange.emit(kase.caseEvents);

          this.toastSvc.showInfoMessage("Case register updated");
        },
        error => {
        console.log(error);
        },
      () => {
        // done
        }
       );
   }


  getCaseLookupValues(){

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

    this.caseSvc
      .fetchCasePaymentItem()
      .subscribe(paymentItems => {
        this.paymentItems = this.dropdownSvc.transform(paymentItems, 'name', 'paymentItemOID');
      });

    this.caseSvc
      .fetchTimeFrequency()
      .subscribe(timeFrequencies => {
        this.timeFrequencies = this.dropdownSvc.transform(timeFrequencies, 'name', 'timeFrequencyOID');
      });

      this.countriesSubscription = this.countriesSvc.get().subscribe(countries => {
        this.countries = this.dropdownSvc.transformSameLabelAndValue(countries, 'name');

      })
    this.partySvc.getAllCourtUsers().subscribe(results => this.courtUsers = results);

    }

  ngOnDestroy(){
    if (this.caseSubscription) {
      this.caseSubscription.unsubscribe();
    }
    if (this.caseTaskSubscription) {
      this.caseTaskSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.countriesSubscription) this.countriesSubscription.unsubscribe();
  }



  hasPermission(pm) {
    if (!this.case) { return false; }
    return this.userSvc.hasPermission(pm);
    // if (!this.case || !this.case.court) return false;
    // let courtOID = this.case.court.courtOID;
    // return this.userSvc.hasPermission(pm, courtOID);
  }

  // tslint:disable: member-ordering
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

    //Check if the user is authorized to view the case

    this.loadingMessage = 'loading case...';
    this.loadingCase = true;


    var recordData: any = {
      case_id: 0,
      loginUserPartyOID: 0,
    };

    recordData.case_id = caseId;
    recordData.loginUserPartyOID = this.userSvc.loggedInUser.partyOID;

    this.caseSubscription = this.caseSvc.authorizedAccessToCourtCase(recordData).subscribe(kase => {
      this.loadingCase = false;

      if (kase == null) {
        this.toastSvc.showWarnMessage('This case has restricted access, you are not authorized to view this case');
      }

      else {

        //NEED TO KEEP TRACK OF THE CASE NUMBER
        this.caseSubscription = this.caseSvc.fetchOne(caseId).subscribe(kase => {
      this.loadingCase = false;
      if (!kase.caseOID) {
        this.toastSvc.showWarnMessage('There is no case with caseOID of ' + caseId + '.', 'No Case Found');
      }

      else {
        this.case = kase;
        console.log("Loading Current Case",kase);

        this.getCaseLookupValues();
        // Remove all files with a '^' in the docName - they are orphans
        this.case.caseDocs = this.case.caseDocs.filter(cd => {
          return cd.documentName.indexOf('^') == -1;
        });

        if (this.case.caseType) {

          // load filtered case phases
          this.caseSvc
            .fetchPhaseByType(this.case.caseType.caseTypeOID)
            .subscribe(results => this.casePhases = results);

          // load filtered case sub types
          this.caseSvc
            .fetchCaseSubType(this.case.caseType.caseTypeOID)
            .subscribe(results => this.caseSubTypes = results);
        }

        this.case.initDocType = this.allTypesFull.filter(fDocTypes => {
          return fDocTypes.name == this.case.initDocType.name;
        })[0];

        if (this.case.caseParties.length > 0) {
          this.case.caseParties.map(cp => {
            cp.caseParty.age = this.calculateAge(cp.caseParty.dob);
          });
        }

        for (let i = 0; i < this.case.caseTasks.length; i++) {
          this.case.caseTasks[i].taskPriorityDesc = this.priorityCodeDesc(this.case.caseTasks[i].taskPriorityCode);
        }

        // cannot use any other object besides the Case object since it is binded to the case service
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


        console.log('Case Applications Retrieved', this.case.caseApplications);



        this.eventTypeFilter = null;
        this.filterCaseEvents();
        this.filterDocs = this.case.caseDocs;
      }
    });
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

      // Load case phases
      this.caseSvc
        .fetchPhaseByType(this.case.caseType.caseTypeOID)
        .subscribe(results => this.casePhases = results);

      // Load case sub types
      this.caseSvc
        .fetchCaseSubType(this.case.caseType.caseTypeOID)
        .subscribe(results => this.caseSubTypes = results);

    } else {
      this.casePhases = [];
      this.caseSubTypes = [];
    }
  }

  /*caseSubTypeChange(event): void {
    if (this.case.caseSubType) {
      this.caseSvc
        .fetchCaseSubType(this.case.caseType.caseTypeOID)
        .subscribe(results => this.caseSubTypes = results);
    } else {
      this.caseSubTypes = [];
    }
  }*/

  isCaseTypeSelected($event) {
    if (!this.case.caseType) {
      this.toastSvc.showWarnMessage('Please choose Case Type first');
    }
  }


  caseDispositionTypeChange(event): void {
    if (this.case.caseDispositionType) {
      this.caseSvc
      .fetchCaseDispositionType()
      .subscribe(results => this.caseDispositionTypes = results);
    }
  }

  isCaseSubTypeSelected($event) {
    if (!this.case.caseType) {
      this.toastSvc.showWarnMessage('Please choose Case Type first');
    }
  }


  priorityCodeDesc(taskPriorityCode): string {

    if (taskPriorityCode == 0)
      return "N/A";

    else if (taskPriorityCode == 1)
      return "Urgent";

    else if (taskPriorityCode == 2)
      return "High";

    else return "Normal";
  }

  ddOnDocCatChange($event) {
    if (this.selCatDT.name === this.docTypesCategories[0].name) {
      // filings
      this.docTypesShown = this.allTypesFull.filter(fDocType => {
        return fDocType.is_filing === 1;
      });
    } else {
      // court_docs
      this.docTypesShown = this.allTypesFull.filter(fDocType => {
        return fDocType.is_court_doc === 1;
      });
    }
  }

  dtNameToCat(name: string): string {
    if (name !== undefined) {
      const eDT: DocumentType[] = this.allTypesFull.filter(fDocType => {
        return fDocType.name === name;
      });
      if (eDT.length >= 1) {
        if (eDT[0].is_filing === 1) {
          return this.docTypesCategories[0].name;
        } else {
          return this.docTypesCategories[1].name;
        }
      }
    }
    return "unknown category";
  }

   dtNameCat(item: CaseDocument): string {
      let catStr = "Undefined";
      let typeStr = "undefined";
      if (item.docCategory === 1 ) {
        catStr="Court Document";
        }
      else {
        catStr= "Filing";
      }
      if (item.documentType == null || item.documentType==="") {
        typeStr="undefined";
        }
      else {
        typeStr= item.documentType;
      return catStr + ": " + typeStr;
      }
    }

  ddOnFilterDTChange($event) {
    /*if (this.filterDT.name==this.docTypesFilter[0].name){
      this.filterDocs=this.case.caseDocs;
    } else {
      this.filterDocs=this.case.caseDocs.filter(docs=>{
        return (this.dtNameToCat(docs.documentType)==this.filterDT.name);
      });
    }
    */
    this.onDtFilterTextChange($event);
  }

  onDtFilterTextChange($event) {
    if (this.filterDT !== undefined) {
      if (this.filterDT.name === this.docTypesFilter[0].name) {
        this.filterDocs = this.case.caseDocs;
      } else {
        this.filterDocs = this.case.caseDocs.filter(docs => {
          return this.dtNameToCat(docs.documentType) === this.filterDT.name;
        });
      }
    } else {
      this.filterDocs = this.case.caseDocs;
    }
    const needles: string[] = this.dtFilterText.toLowerCase().split(" ");
    this.filterDocs = this.filterDocs.filter(docs => {
      let haystack = docs.documentName + this.dtNameToCat(docs.documentType);
      haystack += docs.documentType + docs.lastUpdateDate + docs.documentURL;
      haystack = haystack.toLowerCase();
      let found = false;
      needles.forEach(needle => {
        if (haystack.contains(needle)) {
          found = true;
        }
      });
      return found;
    });
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
    this.showAddConsequenceModal = false;
    this.showDeleteChargeModal = false;
    this.showDeletePartyModal = false;
    this.showModalEditCaseParty = false;
    this.showModalAuthorizedUsers = false;
    this.showModalAddTrafficCaseCharge = false;
    this.showDeleteTrafficChargeConfirmation = false;
  }

  // -------------------------
  //   ADD CASE PARTY MODAL
  // ------------------------=

  showModalAddCaseParty = false;
  showDeletePartyModal = false;
  showModalEditCaseParty = false;
  partySearchText: string;
  partySearchPoliceRegNum: string;

  searchPartyResults: Party[];

  selectedSearchParty: Party;
  selectedSearchPartyRole: CasePartyRole = null;
  selectedSearchPartyStartDate: Date;
  selectedSearchPartyEndDate: Date = null;
  selectedCaseParty: CaseParty = null;
  newCaseParty: CaseParty = new CaseParty();
  genderTypes: any = [{ label: 'M', value: 'M' }, { label: 'F', value: 'F' },];
  showModalAuthorizedUsers = false;

  // -------------------------
  //  START: ADD CASE APPLICATION
  // -------------------------

  showModalAddCaseApplication = false;
  showModalAddCaseOrder = false;
  showModalMaintenancePayments = false;

  applicationStatus: any[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Listed for Hearing', label: 'Listed for Hearing' },
    { value: 'Adjourned – Applicant Attorney unavailable', label: 'Adjourned – Applicant Attorney unavailable' },
    { value: 'Adjourned – Accused Attorney unavailable', label: 'Adjourned – Accused Attorney unavailable' },
    { value: 'Adjourned – Respondent Attorney unavailable', label: 'Adjourned – Respondent Attorney unavailable' },
    { value: 'Adjourned – State Attorney unavailable', label: 'Adjourned – State Attorney unavailable' },
    { value: 'Adjourned – Police Prosecutor unavailable', label: 'Adjourned – Police Prosecutor unavailable' },
    { value: 'Adjourned – Judicial Officer unavailable', label: 'Adjourned – Judicial Officer unavailable' },
    { value: 'Adjourned for service of documents', label: 'Adjourned for service of documents' },
    { value: 'Adjourned for compliance with directions', label: 'Adjourned for compliance with directions' },
    { value: 'Adjourned to produce documents', label: 'Adjourned to produce documents' },
    { value: 'Adjourned – part heard', label: 'Adjourned – part heard' },
    { value: 'Adjourned for decision', label: 'Adjourned for decision' },
    { value: 'Determined – Application dismissed', label: 'Determined – Application dismissed' },
    { value: 'Determined – Application withdrawn', label: 'Determined – Application withdrawn' },
    { value: 'Determined – Application/Bail refused', label: 'Determined – Application/Bail refused' },
    { value: 'Determined – Application/Bail granted', label: 'Determined – Application/Bail granted' },
    { value: 'Determined – Application/Bail granted with electronic monitoring', label: 'Determined – Application/Bail granted with electronic monitoring' },
    { value: 'Determined – Application/Bail granted on Committal to stand trial', label: 'Determined – Application/Bail granted on Committal to stand trial' },
    { value: 'Determined – Application/Bail granted on Appeal', label: 'Determined – Application/Bail granted on Appeal' }

  ];

  paymentItem: any[] = [
    { value: 'Fines', label: 'Fines' },
    { value: 'Fees', label: 'Fees' },
    { value: 'Compensation', label: 'Compensation' }

  ];

  paymentMethod: any[] = [
    { value: 'ACH Credit Transfer', label: 'ACH Credit transfer' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Cheque', label: 'Cheque' },
    { value: 'CourtPay', label: 'CourtPay' },
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Manager’s Cheque', label: 'Manager’s Cheque' },
    { value: 'Personal Cheque', label: 'Personal Cheque' },
    { value: 'Deferred Payment', label: 'Deferred Payment' }


  ];

  paymentTypes: any[] = [
    { value: 'Fines', label: 'Fines' },
    { value: 'Fees', label: 'Fees' },
    { value: 'Compensation', label: 'Compensation' }
  ];


  applicationTypeOnChange(event) {
    this.selectedCaseApplication.caseApplicationType = event.value.caseApplicationTypeOID;
    this.selectedCaseApplication.caseApplicationTypeDisplay = event.value.shortName;

  }

  applicationStatusOnChange(event) {
    this.selectedCaseApplication.caseApplicationStatus = event.value;
  }

  paymentItemOnChange(event, acIdx) {
    this.selectedCasePayment.paymentsDisbursements[acIdx].paymentItemOID = event;
  }

  paymentFrequencyOnChange(event, acIdx) {
    this.selectedCasePayment.paymentsDisbursements[acIdx].timeFrequencyOID = event;
  }

  paymentAmountInOnChange(event,acIdx) {
    console.log('paymentAmountInOnChange',event);
    this.selectedCasePayment.paymentsDisbursements[acIdx].paymentAmountIn = event;
  }

  paymentAmountOrderedOnChange(event,acIdx) {
    this.selectedCasePayment.paymentsDisbursements[acIdx].paymentAmountOrdered = event;
  }

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

  caseCountOnChange(event) {
    this.charge_count = event;
    console.log('Charge Count is',this.charge_count);
  }

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

  communityCodeOnChange(event){
    this.selectedCaseApplication.communityCode = event;
  }

  administrativeAreaCodeOnChange(event){
    this.selectedCaseApplication.administrativeAreaCode = event;
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
       let total = 0;
       for (let i = 0; i < this.selectedCasePayment.paymentsDisbursements.length; i++){
          total = total + this.selectedCasePayment.paymentsDisbursements[i].paymentAmountIn;
        }

        if(this.selectedCasePayment.totalPaymentIn !=  total){
          this.toastSvc.showWarnMessage('Total Payment Amount must MATCH Payment Details Amount', 'Case payment was not saved');
          return;
        }



        this.case.casePayments.push(this.selectedCasePayment); //not working for some reason
        if (this.selectedCasePayment.paymentMethod != "CourtPay") this.selectedCasePayment.processingFee = 0;
        //console.log('Case Payment Details to be saved are', this.selectedCasePayment);

        //Set the values to be used to generate an application number
        //The application type code is set then the case type is selected upon the initial
        //creation of the application.
        if(this.selectedCasePayment.paymentMethod != "CourtPay" && this.selectedCasePayment.receiptNumber == "")
          this.selectedCasePayment.receiptNumber = this.case.caseNumber + "-"+  this.case.casePayments.length++;

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
    this.newCaseParty.caseParty.isOrganization = false;
    this.newCaseParty.caseParty.firstName = "";
    this.newCaseParty.caseParty.lastName = "";
    this.newCaseParty.caseParty.fullName = "";
    this.newCaseParty.caseParty.alternativeName = "";

    this.newCaseParty.startDate = null;
    this.newCaseParty.caseParty.dob = null;
    this.newCaseParty.caseParty.sex = '';
    this.newCaseParty.caseParty.role = null;
    this.newCaseParty.caseParty.policeRegimentalNumber = "";

    this.selectedSearchPartyStartDate = null;
    this.showModalAddCaseParty = true;

    /*this.caseSvc
      .fetchCasePartyRole()
      .subscribe(roles => this.casePartyRoleTypes = roles);*/
  }


  searchForParty() {
    const obj = { "partyName": this.partySearchText };
    this.partySvc
      .fetchAny(obj)
      .subscribe(results => {
        this.searchPartyResults = results;

        if (results.length) {
          this.selectedSearchParty = results[0];
        }
        this.searchPartyResults.map(cp => {
          cp.age = this.calculateAge(cp.dob);
        });
      });
  }

  searchForPartyByPoliceRegNumber() {
    const obj = { "policeRegNum": this.partySearchPoliceRegNum };
    this.partySvc
      .fetchPartyByPoliceRegNum(obj)
      .subscribe(results => {
        this.searchPartyResults = results;

        if (results.length) {
          this.selectedSearchParty = results[0];
        }
        this.searchPartyResults.map(cp => {
          cp.age = this.calculateAge(cp.dob);
        });
      });
  }

  searchPartyOnRowSelect(event) {
    this.selectedSearchParty = event.data;
    this.selectedSearchPartyRole = null;
    this.selectedSearchPartyStartDate = null;
    this.selectedSearchPartyEndDate = null;
  }


  compareByPartyId(item1, item2) {
    return item1.id == item2.partyOID;
  }

  authorizedUsersOnChange(event, authCourtIdx) {

    this.case.authorizedAccessCaseParties[authCourtIdx].partyOID = event.value.id;

    //Pass the names of the authorized users to be recorded in the even register
    this.case.authorizedAccessCaseParties[authCourtIdx].firstName = event.value.firstName;
    this.case.authorizedAccessCaseParties[authCourtIdx].lastName = event.value.lastName;

  }

  saveSealCaseParties(seal_unseal){
    this.saveAuthorizedUsers(seal_unseal);
  }


  saveAuthorizedUsers(seal_unseal,shouldShowSuccessMessage: boolean = true){

    var recordData: any = {
      case_id: 0,
      seqNumber: 0,
      seal_unseal_ind: 0,
      authorized_parties: [],
      case_seal_ind: 0,
      authorized_party_names: ''
    };

    recordData.seqNumber = this.case.sequenceNumber;
    recordData.seal_unseal_ind = seal_unseal;
    recordData.case_id = this.case.caseOID;
    recordData.case_seal_ind = this.case.sealIndicator;

    //extract the party ids and names for sealing a case.
    for(let i = 0; i < this.case.authorizedAccessCaseParties.length; i++){
      recordData.authorized_parties[i] = this.case.authorizedAccessCaseParties[i].partyOID;
      recordData.authorized_party_names += this.case.authorizedAccessCaseParties[i].firstName +' '+this.case.authorizedAccessCaseParties[i].lastName + ', ';

    }

    //If its an unsealed case, add the register and the active judicial officer for the existing case
    //Make sure to pass the names for the event register in the BE
    if (this.case.sealIndicator == 0){

      //This is safe to perform since only a registrar case seal a case
      recordData.authorized_parties[this.case.authorizedAccessCaseParties.length] = this.userSvc.loggedInUser.partyOID;
      recordData.authorized_party_names += this.userSvc.loggedInUser.firstName +' '+this.userSvc.loggedInUser.lastName + ', ';

      //add active judges
      for(let i = 0; i < this.case.judicialAssignments.length; i++){
        if(this.case.judicialAssignments[i].endDate == null){
          recordData.authorized_parties.push(this.case.judicialAssignments[i].judicialOfficial.partyOID);
          recordData.authorized_party_names += this.case.judicialAssignments[i].judicialOfficial.firstName +' '+this.case.judicialAssignments[i].judicialOfficial.lastName + ', ';
        }
      }
    }


    this.caseSvc
      .SealUnsealCourtCase(recordData)
      .subscribe(c => {
        this.loadingCase = false;
        this.showStaticMessage(false);
        this.case = c;
        if (shouldShowSuccessMessage && (recordData.seal_unseal_ind == 0)) {
          this.toastSvc.showSuccessMessage("Case Unsealed");
        }
        if (shouldShowSuccessMessage && (recordData.seal_unseal_ind == 1)) {
          this.toastSvc.showSuccessMessage("Case Sealed");
        }
      },
        (error) => {
          console.log(error);
          this.loadingCase = false;
          this.toastSvc.showErrorMessage('Unable to Seal / Unseal this case file')
        },
        () => {
          this.loadingCase = false;
        });


    this.hideModals();
  }

  addAuthorizedUser() {
    let newAuthorizedUser = new Party();
    let authPartyAppLen = this.case.authorizedAccessCaseParties.push(newAuthorizedUser);
  }

  requestDeleteAuthorizedUser(authCourtIdx) {
    this.case.authorizedAccessCaseParties.splice(authCourtIdx, 1);
  }

  addPartyToCase(caseForm) {
    if (!this.selectedSearchParty) return;

    // Check for duplicate party
    const isPartyOnCase = this.case.caseParties.findIndex(item => item.caseParty.partyOID == this.selectedSearchParty.partyOID) > -1;
    if (isPartyOnCase) {
      this.toastSvc.showWarnMessage('A party can only be added to the case once.', 'Duplicate Party');
      return;
    }

    const caseParty: CaseParty = new CaseParty();
    caseParty.caseParty = this.selectedSearchParty;
    caseParty.role = this.selectedSearchPartyRole;
    caseParty.startDate = this.selectedSearchPartyStartDate ? this.datePipe.transform(this.selectedSearchPartyStartDate, "MM/dd/yyyy") : "";
    caseParty.endDate = this.selectedSearchPartyEndDate ? this.datePipe.transform(this.selectedSearchPartyEndDate, "MM/dd/yyyy") : "";

    const caseParties: CaseParty[] = this.case.caseParties.slice();
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
    const party: Party = this.newCaseParty.caseParty;
    party.dob = party.dob ? this.datePipe.transform(party.dob, "MM/dd/yyyy") : "";

    // SAVE THE PARTY
    this.partySvc.saveParty(party).subscribe(result => {

      this.loadingCase = false;
      this.toastSvc.showSuccessMessage('Party saved');

      // CREATE LOCAL CASE PARTY
      const caseParty: CaseParty = this.newCaseParty;
      caseParty.startDate = caseParty.startDate ? this.datePipe.transform(caseParty.startDate, "MM/dd/yyyy") : "";
      caseParty.endDate = caseParty.endDate ? this.datePipe.transform(caseParty.endDate, "MM/dd/yyyy") : "";
      caseParty.caseParty = result;

      // ADD CASE PARTY TO CASE PARTIES
      const caseParties: CaseParty[] = this.case.caseParties.slice();
      caseParties.push(caseParty);
      this.case.caseParties = caseParties;

      // SAVE OR NOT
      if (caseForm.valid) {
        this.saveCase();
      } else {
        this.showStaticMessage(true, 'warn', 'Please complete Case Details and click Save Case to complete.', 'Complete Case Details');
      }
      caseForm.reset;
      this.hideModals();

    });
  }

  editParty() {
    this.loadingMessage = 'saving party...';
    this.loadingCase = true;

    // CREATE LOCAL PARTY
    const party: Party = this.selectedCaseParty.caseParty;
    party.dob = party.dob ? this.datePipe.transform(party.dob, "MM/dd/yyyy") : "";

    // SAVE THE PARTY
    this.partySvc.saveParty(party).subscribe(result => {

      this.loadingCase = false;
      this.toastSvc.showSuccessMessage('Party saved');

      // CREATE LOCAL CASE PARTY
      const caseParty: CaseParty = this.selectedCaseParty;
      caseParty.startDate = caseParty.startDate ? this.datePipe.transform(caseParty.startDate, "MM/dd/yyyy") : "";
      caseParty.endDate = caseParty.endDate ? this.datePipe.transform(caseParty.endDate, "MM/dd/yyyy") : "";
      caseParty.caseParty = result;

      // ADD CASE PARTY TO CASE PARTIES
      // let caseParties:CaseParty[] = this.case.caseParties.slice();
      // caseParties.push(caseParty);
      // this.case.caseParties =  caseParties;

      this.saveCase();
      this.hideModals();

    });
  }

  saveCase(shouldShowSuccessMessage: boolean = true) {

    /*if (this.case.caseWeight == 0) {
      this.toastSvc.showWarnMessage('The Case Weight must be greater than 0', 'Case Weight Needed');
      return;
    }*/

    if (!this.doesCaseContainRelevantParties().result) {
      this.toastSvc.showWarnMessage(
        this.doesCaseContainRelevantParties().errorMessage,
        this.doesCaseContainRelevantParties().title
      );
      return;
    }

    this.loadingMessage = 'saving case...';
    this.loadingCase = true;
    this.initDocTypeTemp = this.case.initDocType;

    const shouldRefreshURL: boolean = this.case.caseOID == 0;

    this.caseSvc
      .saveCourtCase(this.case)
      .subscribe(c => {
        this.loadingCase = false;
        this.showStaticMessage(false);
        this.case = c;
        this.case.initDocType = this.initDocTypeTemp;
        if (shouldShowSuccessMessage) {
          this.toastSvc.showSuccessMessage("Case Saved");
        }
        if (shouldRefreshURL) {
          this.router.navigate(['/case-detail', this.case.caseOID]);
        }
      },
        (error) => {
          console.log(error);
          this.loadingCase = false;
          this.toastSvc.showErrorMessage('There was an error saving the case.');
        },
        () => {
          this.loadingCase = false;
        });
  }

  fetchCase(next_previous,shouldShowSuccessMessage: boolean = true) {

    this.loadingMessage = 'Case Found...';
    this.loadingCase = true;
    //let currentCase: number = this.case.caseOID;
    //let seal_case:number = this.case.sealIndicator;
    //let shouldRefreshURL: boolean = this.case.caseOID == 0;

    var recordData: any = {
      seqNumber: 0,
      recFlag: 0,
      isAuthorized: false,
      loginUserPartyOID: 0,
      case_id: 0
    };

    recordData.seqNumber = this.case.sequenceNumber;
    recordData.recFlag = next_previous;
    recordData.loginUserPartyOID = this.userSvc.loggedInUser.partyOID;
    recordData.case_id = this.case.caseOID;

    if(this.isRegistrar)
    recordData.isAuthorized = true;

    this.caseSvc
      .fetchNextPreviousCase(recordData)
      .subscribe(c => {
        this.loadingCase = false;
        this.showStaticMessage(false);
        this.case = c;
        if (shouldShowSuccessMessage) {
          this.toastSvc.showSuccessMessage("Case Retrieved");
        }

        if (this.case == null ) {
          this.toastSvc.showWarnMessage('You have already selected the First / Last case')
        }
        else this.router.navigate(['/case-detail', this.case.caseOID])
      },
        (error) => {
          console.log(error);
          this.loadingCase = false;
          this.toastSvc.showWarnMessage('You have already selected the First / Last case')
        },
        () => {
          this.loadingCase = false;
        });
  }

  sealCase(seal_unseal,shouldShowSuccessMessage: boolean = true) {

    if (seal_unseal == 1) this.showModalAuthorizedUsers = true;
    else {
      this.showModalAuthorizedUsers = false;
      this.saveAuthorizedUsers(seal_unseal);
    }
  }


  doesCasePartyContainChild(): boolean {
    return this.case.caseParties.findIndex(cp => cp.role.casePartyRoleOID == 2) > -1;
  }

  doesCasePartyContainApplicant(): boolean {
    return this.case.caseParties.findIndex(cp => cp.role.name === "Applicant") > -1;
  }

  doesCasePartyContainPetitioner(): boolean {
    return this.case.caseParties.findIndex(cp => cp.role.casePartyRoleOID == 17) > -1;
  }

  newCPfNameChanged(event) {
    this.newCaseParty.caseParty.firstName = event;
    if (this.newCaseParty.caseParty.lastName) {
      this.newCaseParty.caseParty.fullName = this.newCaseParty.caseParty.firstName + " "
        + this.newCaseParty.caseParty.lastName;
    } else {
      this.newCaseParty.caseParty.fullName = this.newCaseParty.caseParty.firstName;
    }
  }

  newCPlNameChanged(event) {
    this.newCaseParty.caseParty.lastName = event;
    if (this.newCaseParty.caseParty.firstName) {
      this.newCaseParty.caseParty.fullName = this.newCaseParty.caseParty.firstName + " "
        + this.newCaseParty.caseParty.lastName;
    } else {
      this.newCaseParty.caseParty.fullName = this.newCaseParty.caseParty.lastName;
    }
  }

  newCPlFullNameChanged(event) {
    this.newCaseParty.caseParty.fullName = event;
  }

  newCPaltNameChanged(event) {
    console.log('newCPaltNameChanged(event)', event);
    this.newCaseParty.caseParty.alternativeName = event;
  }

  newCPdobChange(event) {
    console.log(event);
    this.newCaseParty.caseParty.dob = event;
  }

  newCPsexChange(event) {
    this.newCaseParty.caseParty.sex = event;
  }

  newCPoliceRegNumOnChange(event) {
    this.newCaseParty.caseParty.policeRegimentalNumber = event;
  }

  newCasePartyRoleTypeOnChange(event) {
    console.log(event);
    this.newCaseParty.role = event.value;
  }

  // -------------------------
  //   ADD CASE CHARGE MODAL
  // ------------------------=

  showModalAddCaseCharge = false;
  showDeleteChargeModal = false;

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
  policeChargeDesc: string;
  charge_count: number = 1;
  charge_id: string;

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
        const text = `${o.categoryIdentifier} ${o.localCharge}`;

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
    const query = event.query;
    this.filteredChargeFactorCategory = this.filterChargeFactorCategory(query, this.filteredChargeFactorCategory);
  }

  filterChargeFactorCategory(query, chargeFactorCategory: any[]): any[] {
    const filtered: any[] = [];

    for (let i = 0; i < chargeFactorCategory.length; i++) {

      filtered.push(chargeFactorCategory[i]);

    }
    return filtered;
  }


  getChargeFactorsToFilter(event, selCFC: ChargeFactorCategory) {
    const query = event.query;
    this.filteredChargeFactorTypes = this.filterChargeFactors(query, selCFC, this.chargeFactorTypes);
  }


  filterChargeFactors(query, selcfc: ChargeFactorCategory, cfactors: ChargeFactor[]): any[] {


    const filtered: any[] = [];
    const catID: number = selcfc.chargeFactorCategoryId;
    const catCID: number = selcfc.courtOID;

    for (let i = 0; i < cfactors.length; i++) {

      if (catID === cfactors[i].disaggregationID.valueOf()) {

        filtered.push(cfactors[i]);
      }
    }

    return filtered;
  }//filtereChargeFactors

  //RS Implementing Charge Factor Variables, the results returned are based on the user's selection of a charge factor
  getChargeFactorsVariablesToFilter(event, selCF: ChargeFactor) {
    const query = event.query;
    this.filteredChargeFactorVariables = this.filterChargeFactorVariables(query, selCF, this.chargeFactorVariables);
  }

  filterChargeFactorVariables(query, selcf: ChargeFactor, cfVariables: ChargeFactorVariable[]): any[] {

    let i = 0;
    const filtered: any[] = [];

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

    const iccsCode: IccsCode = this.setIccsCodes();

    // CHECK FOR DUPLICATE CHARGE
    if (this.checkForDupCharge(iccsCode)) {
      this.toastSvc.showWarnMessage('Duplicate charges are not permitted.', 'Duplicate Charge');
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
    charge.chargeDetails = this.policeChargeDesc;
    charge.localCharge = this.selectedChargeLawType;
    charge.iccsCode = this.selectedCharge.iccsCode;
    charge.charge_id = this.charge_id;
    charge.charge_count = this.charge_count;

    console.log ('Charge ID is ', charge.charge_id);
    console.log ('Charge Count is ', charge.charge_count);

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
    const charges: CaseCharge[] = this.case.caseCharges;
    const idx: number = charges.findIndex(c => ObjectUtils.areObjectsEqualDeep(c.iccsCode, iccsCode));
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

  doesCasePartyContainDefendant(): boolean {
    return (
      this.case.caseParties.findIndex(cp => cp.role.name === "Defendant") > -1
    );
  }

  doesCasePartyContainComplainant(): boolean {
    return (
      this.case.caseParties.findIndex(cp => cp.role.name === "Complainant") > -1
    );
  }

  doesCasePartyContainAccused(): boolean {
    return (
      this.case.caseParties.findIndex(cp => cp.role.name === "Accused") > -1
    );
  }

  doesCaseContainRelevantParties(): ResponseObject {

    const response = new ResponseObject();

    if (this.case.caseType.name.contains("Tickets")) {
        response.result = this.doesCasePartyContainApplicant() && this.doesCasePartyContainDefendant();

      if (!response.result && !this.doesCasePartyContainApplicant() && !this.doesCasePartyContainDefendant()) {

        response.title = "Required Parties Missing";
        response.errorMessage = "This case needs a Defendant party and an Applicant Party to be added before it can be saved";
      }
      else if (!response.result && !this.doesCasePartyContainDefendant()) {
        response.title = "Defendant Party Missing";
        response.errorMessage =
        "This case needs a Defendant party to be added before it can be saved";
      }
      else if (!response.result && !this.doesCasePartyContainComplainant()) {
        response.title = "Applicant Party Missing";
        response.errorMessage =
        "This case needs an Applicant Party to be added before it can be saved";
      }
    }

    else if (this.case.caseType.name.contains("Health")) {

      response.result = (this.doesCasePartyContainDefendant()) && this.doesCasePartyContainComplainant();

      if (!response.result && !this.doesCasePartyContainComplainant() && !this.doesCasePartyContainDefendant()) {
          response.title = "Required Parties Missing";
          response.errorMessage =
          "This case needs a Defendant party and a Complainant Party to be added before it can be saved";
      }


        else if (!this.doesCasePartyContainDefendant()) {
          response.title = "Defendant Party Missing";
          response.errorMessage =
          "This case needs an Defendant party to be added before it can be saved";
        }
        else if (!this.doesCasePartyContainComplainant()) {
          response.title = "Complainant Party Missing";
          response.errorMessage =
          "This case needs a Complainant Party to be added before it can be saved";
        }

    }

    // Only an Applicant is needed for Case Types of Bail Applications for High Courts
    else if (this.case.caseType.name.contains("Bail Application")) {

            response.result = this.doesCasePartyContainApplicant();
            if (!response.result) {
                response.title = "Required Party Missing";
                response.errorMessage = "This case needs an 'Applicant' party to be added before it can be saved";
            }
    }
    // Only an Accused is needed for Case Types for High Courts
    else if (this.case.caseType.name.contains("Anti-Gang Act")
            || this.case.caseType.name.contains("Application")
            || this.case.caseType.name.contains("Application for Re-Arrest")
            || this.case.caseType.name.contains("Bail review application")
            || this.case.caseType.name.contains("Complaint on oath")
            || this.case.caseType.name.contains("Complaint without oath")
            || this.case.caseType.name.contains("Indictable Offence")
            || this.case.caseType.name.contains("Indictment")
            || this.case.caseType.name.contains("Interception of Communications Act")
            || this.case.caseType.name.contains("Notice of Intention to Plead Guilty")
            || this.case.caseType.name.contains("Plea Agreement")
            || this.case.caseType.name.contains("Proceeds of Crime Act")
            || this.case.caseType.name.contains("Triable either way")) {

            response.result = this.doesCasePartyContainAccused();
            if (!response.result) {
                response.title = "Required Party Missing";
                response.errorMessage = "This case needs an Accused party to be added before it can be saved";
            }
    }

    else{ // All other Case Types for District Courts.

      response.result = (this.doesCasePartyContainAccused()) && this.doesCasePartyContainComplainant();

      if (!response.result && !this.doesCasePartyContainComplainant() && !this.doesCasePartyContainAccused()) {
        response.title = "Required Parties Missing";
        response.errorMessage =
        "This case needs an Accused party and a Complainant Party to be added before it can be saved";
      }

      else if (!this.doesCasePartyContainAccused()) {
        response.title = "Accused Party Missing";
        response.errorMessage =
        "This case needs an Accused party to be added before it can be saved";
      }
      else if (!this.doesCasePartyContainComplainant()) {
        response.title = "Complainant Party Missing";
        response.errorMessage =
        "This case needs a Complainant Party to be added before it can be saved";
      }

    }
    return response;
  }



  // ------------------------------------------------
  //   ADD CASE TASK MODAL
  // -----------------------------------------------=

  selectedCaseTask: CaseTask;

  showModalAddCaseTask = false;
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
  loadingCaseTaskLookups = false;

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
    if (event.data.taskCheckedOutBy == 1) this.selectedCaseTask.taskCheckedOut = true;
  }


  onShowCaseTaskModal(taskTypeId?) {
    this.showModalAddCaseTask = true;
    if (this.caseTaskSubscription) {
      this.initCaseTaskModal(taskTypeId);
      return;
    }

    this.loadingCaseTaskLookups = true;
    const source = Observable.forkJoin<any>(
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
        this.toastSvc.showErrorMessage('There was an error fetching task reference data.');
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

    for (let i = 0; i < this.case.caseTasks.length; i++) {

      this.case.caseTasks[i].taskPriorityDesc = this.priorityCodeDesc(this.case.caseTasks[i].taskPriorityCode);

    }

  }



  onCancelCaseTask(form) {
    //This would not overwrite the actual cast task:completion date with incorrect display data
    if (this.actualCompletionDate == null) this.selectedCaseTask.taskDoneDate = null;
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
  taskCheckedOutOnChange(event) {
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
    const task = new CaseTaskDTO();
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
      const savedTask = result[0];

      if (this.selectedCaseTask.assignedParty)
        Object.assign(this.selectedCaseTask.assignedParty, savedTask.assignedParty);

      if (this.selectedCaseTask.assignedPool)
        Object.assign(this.selectedCaseTask.assignedPool, savedTask.assignedPool);


      if (this.selectedCaseTask.assignedDate)
        Object.assign(this.selectedCaseTask.assignedDate, savedTask.assignedDate);

      const task = this.selectedCaseTask;

      // see if item exists in list
      const idx = this.case.caseTasks.findIndex(item => item.taskOID == task.taskOID);

      if (idx > -1) this.case.caseTasks[idx] = task;

      else {
        this.case.caseTasks.push(task);
        this.case.caseTasks = this.case.caseTasks.slice();

      }

      // Refresh the grid --------
      //this.case.caseTasks = this.case.caseTasks.slice();
      this.saveCase();

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

  showModalAddJudge = false;
  judges: JudicialOfficer[];
  judge: JudicialAssignment = new JudicialAssignment();
  loadingJudgeLookups = false;


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
          this.toastSvc.showErrorMessage('There was an error fetching judicial data.');
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
      const isJudgeOnCase = this.case.judicialAssignments
        .findIndex(item => item.judicialOfficial.partyOID == this.judge.judicialOfficial.partyOID) > -1;
      if (isJudgeOnCase) {
        this.toastSvc.showWarnMessage('A judge can only be added to the case once.', 'Duplicate Judge');
        return;
      }
    }

    this.judge.caseOID = this.case.caseOID;

    //Passing these parameters will allow the automatic addition and removel of
    //JO from sealed cases. The event register will also be updated
    this.judge.caseSeqNumber = this.case.sequenceNumber;
    this.judge.case_seal_indicator = this.case.sealIndicator;
    this.judge.partyOID = this.judge.judicialOfficial.partyOID;

    this.caseSvc
      .saveJudicialAssignment(this.judge)
      .subscribe(assignment => {
        const index: number = this.case.judicialAssignments
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
    this.saveCase();
  }


  // -------------------------
  //   ADD COMPLETED EVENT MODAL
  //   (in Register tab)
  // ------------------------=

  showModalAddEvent = false;
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
    console.log('this.caseEvent.caseEventOID BEFORE SAVE', this.caseEvent.caseEventOID);
    this.caseEvent.initiatedByParty = this.selectedInitiatedByParty && this.selectedInitiatedByParty.caseParty ? this.selectedInitiatedByParty.caseParty : null;

    this.caseSvc
      .saveCaseEvent(this.caseEvent)
      .subscribe(savedCaseEvent => {
        console.log('savedCaseEvent.caseEventOID AFTER SAVE', savedCaseEvent.caseEventOID);
        savedCaseEvent.eventType = this.eventTypes.find(e => e.eventTypeOID == savedCaseEvent.eventType.eventTypeOID);

        const index: number = this.case.caseEvents
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
  uploadPVis: boolean;
  uploadPMsg: string;

  generateDoc(): void {
    this.caseSvc
      .downloadCourtDocument(
        this.case.caseOID,
        this.selectedDocumentTemplateType.name,
        this.selectedDocumentTemplateType.filename
        // this.selectedDocumentTemplateType.fname

      )
      .subscribe();
  }

  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    console.log("post upload!!");
    console.log(event.xhr.response);
    this.uploadPMsg = "updating case documents...";
    const currCaseOID: string = (this.case.caseOID as any) as string;
    console.log(currCaseOID);
    this.caseSubscription = this.caseSvc.fetchOne(currCaseOID).subscribe(
      kase => {
        this.case.caseDocs = kase.caseDocs;
        this.filterDocs = this.case.caseDocs;
        this.toastSvc.showInfoMessage("Case Documents updated");
      },
      error => {
        this.toastSvc.showInfoMessage("Updating Case");
        setTimeout(() => {
          this.router
            .navigateByUrl("/admin", { skipLocationChange: true })
            .then(() =>
              this.router.navigate(["/case-detail", this.case.caseOID])
            );
        }, 1000);
      },
      () => {
        this.uploadPVis = false;
      }
    );
    const oUploadResp = JSON.parse(event.xhr.status);
    if (oUploadResp == "200") {
      this.toastSvc.showSuccessMessage("File Uploaded");
    } else {
      this.toastSvc.showWarnMessage("File upload failed.");
      console.log(oUploadResp.error);
    }
  }

  onBeforeSendFile(event) {
    this.uploadPMsg = "please wait, uploading file ...";
    this.uploadPVis = true;
    if (
      this.selDocTypeUpload === null ||
      this.selDocTypeUpload === undefined ||
      this.selCatDT === null ||
      this.selCatDT === undefined
    ) {
      this.toastSvc.showWarnMessage(
        "Please specify the document type being uploaded"
      );
      event.xhr.abort();
      this.uploadPVis = false;
    } else {
      // console.log("onBeforeSendFile called!!");
      // console.log(event);
      event.xhr.setRequestHeader("caseOID", this.case.caseOID);
      event.xhr.setRequestHeader("Authorization", "Bearer " + this.authToken);
      event.xhr.setRequestHeader("token", this.authToken);
      event.xhr.setRequestHeader("docCat", (this.selDocTypeUpload.is_court_doc===1?"1":"0")); // JSON.stringify(this.selDocTypeUpload));
      event.xhr.setRequestHeader("docType", this.selDocTypeUpload.name);       // event.formData.append('test', 'A123'); // vb, note: send all params like this henceforth
    }
  }

  ddOnChange(event): void {
  }

  ddOnChangeSubType(event): void {
  }

  saveNewSentencingItem(item: CriminalCharge) : void {
    item.caseNumber = this.case.caseNumber;
    item.caseId = this.case.caseOID;
    let dynamicFieldsTempObject = {};

    if(this.selectedCriminalCharge.arrayFromDynamicFields) {
      this.selectedCriminalCharge.arrayFromDynamicFields.forEach(df => {
        Object.defineProperty(dynamicFieldsTempObject, df.property, {   // dynamically define the properties
          value: df.value,
          writable: true,
          enumerable: true    // important for JSON.stringtify to return valid
        });
      });

      let dynamicFields = JSON.stringify(dynamicFieldsTempObject);

      dynamicFields = dynamicFields.replace(/"/g, "'");   // replacing double quotes with single quotes for the BE to accept it
      item.dynamicFields = dynamicFields;   // now we are ready to save it
    }


    this.sentencingSvc.postByType(item).subscribe(result => {
      this.selectedCriminalCharge = result;
      this.getDynamicFields();    // rebuild the dynamic fields array
      this.toastSvc.showSuccessMessage('Item saved');
    });
   }

  // TODO: change name to serialize dynamic fields
   getDynamicFields() {

    if(this.selectedCriminalCharge.dynamicFields) {
      let dynamicFieldsObject;

      // clean up any extra characters
      dynamicFieldsObject = this.selectedCriminalCharge.dynamicFields.replace(/\\n/g, "\\n")
         .replace(/\\'/g, "\\'")
         .replace(/\\"/g, '\\"')
         .replace(/\\&/g, "\\&")
         .replace(/\\r/g, "\\r")
         .replace(/\\t/g, "\\t")
         .replace(/\\b/g, "\\b")
         .replace(/\\f/g, "\\f");
      // remove non-printable and other non-valid JSON chars
      dynamicFieldsObject = dynamicFieldsObject.replace(/[\u0000-\u0019]+/g,"");

      let parsedJson = JSON.parse(dynamicFieldsObject.replace(/'/g, '"'));  // put back double quotes

      let keysFromDynamicFields = Object.keys(parsedJson);
      this.selectedCriminalCharge.arrayFromDynamicFields = [];

      for (let prop of keysFromDynamicFields) {   // create dynamic array to iterate later
        this.selectedCriminalCharge.arrayFromDynamicFields.push({"property": prop, "value": parsedJson[prop]});
      }
    }

   }

  onSentencingSelectionChange(event, template) {
    // deselect all others & set selected
    if (event.selected) {
      event.source.selectionList.options.toArray().forEach(element => {
        if (element.value.id != template.id) {
          element.selected = false;
        } else {
          this.selectedCriminalCharge = element.value;
          this.getDynamicFields();
        }
      });
    }
  }

  onDocTagModalSelectionChange(event, docType) {
    // deselect all others & set selected
    if (event.selected) {
      event.source.selectionList.options.toArray().forEach(element => {
        if (element.value.type != docType.type) {
          element.selected = false;
        } else {
          this.docType = element.value.type;
        }
      });
    }
  }

  onSentencingModalSelectionChange(event, template) {
    // deselect all others & set selected
    if (event.selected) {
      event.source.selectionList.options.toArray().forEach(element => {
        if (element.value.chargeDescription != template.chargeDescription) {
          element.selected = false;
        } else {
          this.selectedConsequence = element.value;
        }
      });
    }
  }

  showFieldToggle() {
    this.showField = true;
  }

  addNewDynamicField() {

    if(!this.selectedCriminalCharge.arrayFromDynamicFields) {
      this.selectedCriminalCharge.arrayFromDynamicFields = [];    // initialize if not there
    }

    this.selectedCriminalCharge.arrayFromDynamicFields.push({"property": this.dynamicField.name+'_'+this.dynamicField.type, "value": null});

  }

  addNewConsequence(item) {
    item.caseId = this.case.caseOID;
    item.caseNumber = this.case.caseNumber;
    this.sentencingSvc.postByType(item).subscribe(result => {
      this.sentencingSvc.getAllByCaseId(this.case.caseOID).subscribe(criminalConsequences => {
        this.criminalConsequences = criminalConsequences;
        this.hideModals();
        this.toastSvc.showSuccessMessage('New Consequence added');
      });
    });
  }



}
