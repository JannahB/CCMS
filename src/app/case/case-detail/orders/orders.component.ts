import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { Case } from "../../../common/entities/Case";
import { OrderTemplate } from "../../../common/entities/OrderTemplate";
import { CaseEvent } from "../../../common/entities/CaseEvent";
import { OrderService } from "../../../common/services/http/order.service";
import { UserService } from "../../../common/services/utility/user.service";
import { Permission } from "../../../common/entities/Permission";
import { Order } from "../../../common/entities/Order";
import { ConfirmationService } from "primeng/components/common/confirmationservice";
import { Message } from "primeng/components/common/message";
import { RegisterEntry } from "../../../common/entities/RegisterEntry";
import { CaseService } from "../../../common/services/http/case.service";
import { CaseRegisterService } from "../../../common/services/http/case-register.service";
import { ToastService } from "../../../common/services/utility/toast.service";
import { NgForm } from "@angular/forms";
import { CaseTrafficCharge } from "../../../common/entities/CaseTrafficCharge";
import { Observable } from "rxjs/Observable";
import { TrafficCharge } from "../../../common/entities/TrafficCharge";
import { Party } from "../../../common/entities/Party";
import { PartyService } from "../../../common/services/http/party.service";
import { Address } from "../../../common/entities/Address";
import { Identifier } from "../../../common/entities/Identifier";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  providers: [ConfirmationService],
})
export class OrdersComponent implements OnInit, OnDestroy {
  @Input() case: Case;
  @Input() onlyAddOrder: boolean;
  @Output() caseChange = new EventEmitter<Case>();

  @Input() filteredEvents: CaseEvent[];
  @Output() filteredEventsChange = new EventEmitter<CaseEvent[]>();

  orderTemplates: OrderTemplate[];
  filteredTemplates: OrderTemplate[];
  selectedTemplate: OrderTemplate;
  defaultTerms: {
    label: string;
    value: { id: number; name: string; code: string };
  }[];
  orderOutcomes: {
    label: string;
    value: { id: number; name: string; code: string };
  }[];
  selectedDefaultTerm: string;
  public Permission: any = Permission;
  orders: Order[];
  selectedOrder: Order;
  selectedOutcome: any;
  showModalAddOrder: boolean;
  isEdit: boolean;
  msgs: Message[] = [];
  caseTrafficCharges: CaseTrafficCharge[];
  trafficSubscription: any;
  trafficCharges: TrafficCharge[];
  allCaseTrafficCharges: CaseTrafficCharge[];
  loadingDataFlag = false;
  csLocation: string;
  bondAmount: number;
  disqualified: boolean;
  frequency: number;
  csHours: number;
  revoked: boolean;
  pbTimes: number;
  defaultTerm: any;
  citationNumber: string;
  orderToSend: Order;
  selectedOrderBak: Order;
  selectedOrderIdx: number;
  csStartDate: any;
  taTimePeriod: any;
  taDueDate: any;
  bdTimePeriod: any;
  pbTimePeriod: any;
  pbFrequency: any;
  compTimePeriod: any;
  compAmount: any;
  dqTimePeriod: any;
  dqStartDate: any;
  rvStartDate: any;
  fwTimePeriod: any;
  timeUnits: any;
  selectedTimeUnit: any;
  fwValue: number;
  taValue: number;
  dqValue: number;
  bdValue: number;
  pbValue: number;
  compValue: number;
  fullApplicant: Party;
  applicantAddress: Address;
  applicantDP: Identifier;
  penalty: number;
  routeSubscription: Subscription;

  constructor(
    private orderSvc: OrderService,
    private userSvc: UserService,
    private confirmationService: ConfirmationService,
    private caseSvc: CaseService,
    private caseRegSvc: CaseRegisterService,
    private toastSvc: ToastService,
    private partySvc: PartyService,
    private activatedRoute: ActivatedRoute
  ) {
    this.defaultTerms = [
      {
        label: "Hard Labour",
        value: { id: 1, name: "Hard Labour", code: "HI" },
      },
      {
        label: "Simple Imprisonment",
        value: { id: 2, name: "Simple Imprisonment", code: "SI" },
      },
    ];
    this.orderOutcomes = [
      { label: "Liable", value: { id: 1, name: "Liable", code: "L" } },
      { label: "Not Liable", value: { id: 2, name: "Not Liable", code: "NL" } },
    ];
    this.timeUnits = [
      { label: "hours", value: { name: "hours" }, code: "hr" },
      { label: "days", value: { name: "days" }, code: "dy" },
      { label: "weeks", value: { name: "weeks" }, code: "wk" },
      { label: "months", value: { name: "months" }, code: "mth" },
      { label: "years", value: { name: "years" }, code: "yr" },
    ];
  }

  ngOnInit() {
    this.getTrafficData(this.case.caseOID);
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.trafficSubscription) {
      this.trafficSubscription.unsubscribe();
    }
  }

  hasPermission(pm: number) {
    if (!this.case) {
      return false;
    }
    return this.userSvc.hasPermission(pm);
  }

  ddOutcomeOnChange(event) {
    this.filteredTemplates = this.orderTemplates.filter(
      (x) => x.outcome === event.value.label
    );
  }

  ddTemplateOnChange(event) {
    this.selectedTemplate = event.value;
  }

  orderOnRowSelect(event) {
    this.setSelectedOrder(event.data);
    this.showModalAddOrder = true;
  }

  setSelectedOrder(order?: Order) {
    if (!order) {
      this.createOrder();
      return;
    }
    this.selectedOrder = order;

    this.selectedOutcome = this.orderOutcomes.find(
      (x) => x.value.name === order.outcome
    );

    this.filteredTemplates = this.orderTemplates.filter(
      (x) => x.outcome === order.outcome
    );

    this.selectedTemplate = this.filteredTemplates.find(
      (x) => x.name === order.orderType
    );

    this.copySelectedItem();
  }

  createOrder() {
    // if new order
    if (this.orders.findIndex((h) => h.id === 0) > -1) {
      this.toastSvc.showWarnMessage(
        "Only one new order can be created at a time."
      );
      return;
    }
  }

  private copySelectedItem() {
    this.selectedOrderBak = Object.assign({}, this.selectedOrder);
    this.selectedOrderIdx = this.getIndexOfItem(this.selectedOrder);
  }

  private getIndexOfItem(item = this.selectedOrder): number {
    return this.orders.findIndex((itm) => itm.id === item.id);
  }

  showOrderModal() {
    this.showModalAddOrder = true;
    this.isEdit = false;
    const newOrder = new Order();
    this.selectedOutcome = null;
    this.selectedTemplate = null;
    this.selectedOrder = newOrder;
  }

  public updateRegister() {
    const currCaseOID: string = (this.case.caseOID as any) as string;
    this.caseSvc.fetchOne(currCaseOID).subscribe(
      (kase) => {
        this.filteredEventsChange.emit(kase.caseEvents);

        this.toastSvc.showInfoMessage("Case register updated");
      },
      (error) => {
        console.log(error);
      },
      () => {
        // done
      }
    );
  }

  getTrafficData(caseId: number) {
    this.loadingDataFlag = true;
    const source = Observable.forkJoin<any>(
      this.caseSvc.fetchTrafficCharge(),
      this.caseSvc.fetchCaseTrafficCharge(caseId),
      this.caseSvc.fetchCaseTrafficCharges(),
      this.orderSvc.getOrderTemplates()
    );
    this.trafficSubscription = source.subscribe(
      (results) => {
        this.trafficCharges = results[0] as TrafficCharge[];
        this.caseTrafficCharges = results[1] as CaseTrafficCharge[];
        this.allCaseTrafficCharges = results[2] as CaseTrafficCharge[];
        this.orderTemplates = results[3] as OrderTemplate[];
        this.getCaseTrafficChargesData();
      },
      (error) => {
        console.log("get Traffic Data error", error);
        this.toastSvc.showErrorMessage(
          "There was an error fetching traffic data."
        );
      },
      () => {
        this.loadingDataFlag = false;
      }
    );
  }

  defaultTermOnChange(event) {
    this.defaultTerm = event.value;
  }

  timeUnitOnChange(event) {
    this.selectedTimeUnit = event.value;
  }

  private getCaseTrafficChargesData() {
    if (this.caseTrafficCharges.length > 0) {
      this.citationNumber = this.caseTrafficCharges[0].citationNumber;
      this.caseTrafficCharges.forEach((ctc) => {
        ctc.trafficCharge = this.trafficCharges.find(
          (c) => c.id === ctc.trafficChargeId
        );
      });
    }
    this.getOrderData(this.case.caseNumber);
  }

  getOrderData(caseNumber: string) {
    this.orderSvc
      .getOrdersByOffence(caseNumber)
      .subscribe((found) => (this.orders = found));
  }

  // saveOrder(form: NgForm) {
  //   const order = this.selectedOrder;

  //   order.orderDate = new Date();

  //   if (this.case.caseType.name === "Tickets/Notice to Contest") {
  //     order.reference = this.caseTrafficCharges[0].citationNumber;
  //     order.demeritPoints = this.caseTrafficCharges[0].trafficCharge.demeritPoints;
  //   }

  //   order.outcome = this.selectedOutcome.value.name;
  //   order.orderType = this.selectedTemplate.name;
  //   order.caseNumber = this.case.caseNumber;

  //   if (order.orderType === "Forthwith Payment") {
  //     order.fwFineAmount =
  //       this.case.caseType.name === "Tickets/Notice to Contest"
  //         ? this.caseTrafficCharges[0].trafficCharge.penalty
  //         : this.penalty;
  //     // order.fwTimePeriod = this.fwTimePeriod ? this.fwTimePeriod : null;
  //     order.fwTimePeriod =
  //       this.fwValue + " " + this.selectedTimeUnit.value.name;
  //     order.fwTimeUnit = this.selectedTimeUnit.value.name;
  //     order.fwTimeValue = this.fwValue;
  //     order.fwDefaultTerms = this.defaultTerm
  //       ? this.defaultTerm.value.name
  //       : null;
  //   } else if (
  //     order.orderType === "Time Allowed" ||
  //     order.orderType === "Time Allowed (alternate)"
  //   ) {
  //     order.taFineAmount =
  //       this.case.caseType.name === "Tickets/Notice to Contest"
  //         ? this.caseTrafficCharges[0].trafficCharge.penalty
  //         : this.penalty;
  //     // order.taTimePeriod = this.taTimePeriod ? this.taTimePeriod : null;
  //     order.taTimePeriod =
  //       this.taValue + " " + this.selectedTimeUnit.value.name;
  //     order.taTimeUnit = this.selectedTimeUnit.value.name;
  //     order.taTimeValue = this.taValue;
  //     order.taDueDate = this.taDueDate ? this.taDueDate : null;
  //     order.taDefaultTerms = this.defaultTerm
  //       ? this.defaultTerm.value.name
  //       : null;
  //   } else if (order.orderType === "Community Service") {
  //     order.csHours = this.csHours ? this.csHours : null;
  //     order.csLocation = this.csLocation ? this.csLocation : null;
  //     order.csStartDate = this.csStartDate ? this.csStartDate : null;
  //   } else if (order.orderType === "Bonded") {
  //     // order.bdTimePeriod = this.bdTimePeriod ? this.bdTimePeriod : null;
  //     order.bdTimePeriod =
  //       this.bdValue + " " + this.selectedTimeUnit.value.name;
  //     order.bdTimeUnit = this.selectedTimeUnit.value.name;
  //     order.bdTimeValue = this.bdValue;
  //     order.bondAmount = this.bondAmount ? this.bondAmount : null;
  //   } else if (
  //     order.outcome === "Not Liable" &&
  //     order.orderType === "Dismissed"
  //   ) {
  //     order.demeritPoints = 0;
  //   } else if (order.orderType === "Probation") {
  //     // order.pbTimePeriod = this.pbTimePeriod ? this.pbTimePeriod : null;
  //     order.pbTimePeriod =
  //       this.pbValue + " " + this.selectedTimeUnit.value.name;
  //     order.pbTimeUnit = this.selectedTimeUnit.value.name;
  //     order.pbTimeValue = this.pbValue;
  //     order.pbFrequency = this.pbFrequency ? this.pbFrequency : null;
  //     order.pbTimes = this.pbTimes ? this.pbTimes : null;
  //   } else if (order.orderType === "Compensation") {
  //     // order.compTimePeriod = this.compTimePeriod ? this.compTimePeriod : null;
  //     order.compTimePeriod =
  //       this.compValue + " " + this.selectedTimeUnit.value.name;
  //     order.compTimeUnit = this.selectedTimeUnit.value.name;
  //     order.compTimeValue = this.compValue;
  //     order.compDefaultTerms = this.defaultTerm
  //       ? this.defaultTerm.value.name
  //       : null;
  //     order.compAmount = this.compAmount ? this.compAmount : null;
  //   } else if (order.orderType === "License Suspended") {
  //     order.disqualified =
  //       this.selectedTemplate.name === "License Suspended" ? true : false;
  //     order.dqStartDate = this.dqStartDate ? this.dqStartDate : null;
  //     // order.dqTimePeriod = this.dqTimePeriod ? this.dqTimePeriod : null;
  //     order.dqTimePeriod =
  //       this.dqValue + " " + this.selectedTimeUnit.value.name;
  //     order.dqTimeUnit = this.selectedTimeUnit.value.name;
  //     order.dqTimeValue = this.dqValue;
  //   } else if (order.orderType === "License Revoked") {
  //     order.revoked =
  //       this.selectedTemplate.name === "License Revoked" ? true : false;
  //     order.rvStartDate = this.rvStartDate ? this.rvStartDate : null;
  //   }

  //   //#region Register Entry
  //   // register entry save
  //   const regEntry: RegisterEntry = new RegisterEntry();
  //   if (this.isEdit) {
  //     regEntry.description = "Order updated!";
  //   } else {
  //     regEntry.description =
  //       order.orderType + " order created. " + JSON.stringify(order);
  //   }

  //   regEntry.caseOID = (this.case.caseOID as any) as string;
  //   regEntry.eventTypeName = "UPTD";

  //   this.caseRegSvc.save(regEntry).subscribe(
  //     (result) => {
  //       this.updateRegister();
  //     },
  //     (error) => {
  //       console.log(error);
  //     },
  //     () => {
  //       // final
  //     }
  //   );

  //   //#endregion

  //   this.orderSvc.save(order).subscribe(
  //     (result) => {
  //       this.getOrders(result);
  //       this.toastSvc.showSuccessMessage("Order Component Saved");
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.toastSvc.showErrorMessage(
  //         "There was an error while saving orders."
  //       );
  //     },
  //     () => {
  //       // final
  //     }
  //   );
  //   this.hideModal();
  //   form.reset();
  // }

  saveOrder(form: NgForm) {
    const order = this.selectedOrder;

    order.orderDate = new Date();

    if (this.case.caseType.name === "Tickets/Notice to Contest") {
      order.reference = this.caseTrafficCharges[0].citationNumber;
      order.demeritPoints = this.caseTrafficCharges[0].trafficCharge.demeritPoints;
    }

    // console.log('SaveOrder Liable Option', this.selectedOutcome.value);
    
    order.outcome = this.selectedOutcome.value.name;
    order.orderType = this.selectedTemplate.name;
    order.caseNumber = this.case.caseNumber;

    if (order.orderType === "Forthwith Payment") {

      order.fwFineAmount =
        this.case.caseType.name === "Tickets/Notice to Contest"
          ? this.caseTrafficCharges[0].trafficCharge.penalty
          : this.penalty;
      // order.fwTimePeriod = this.fwTimePeriod ? this.fwTimePeriod : null;
      order.fwTimePeriod = this.fwValue + " " + this.selectedTimeUnit.value.name;
      order.fwTimeUnit = this.selectedTimeUnit.value.name;
      order.fwTimeValue = this.fwValue;
      order.fwDefaultTerms = this.defaultTerm
        ? this.defaultTerm.value.name
        : null;
    } 
    
    if ( order.orderType === "Time Allowed" ||order.orderType === "Time Allowed (alternate)") {
      
      order.taFineAmount =
        this.case.caseType.name === "Tickets/Notice to Contest"
          ? this.caseTrafficCharges[0].trafficCharge.penalty
          : this.penalty;
      order.taTimePeriod = this.taTimePeriod ? this.taTimePeriod : null;
      order.taTimePeriod = this.taValue + " " + this.selectedTimeUnit.value.name;
      order.taTimeUnit = this.selectedTimeUnit.value.name;
      order.taTimeValue = this.taValue;
      order.taDueDate = this.taDueDate ? this.taDueDate : null;
      order.taDefaultTerms = this.defaultTerm
        ? this.defaultTerm.value.name
        : null;


        order.fwFineAmount =
        this.case.caseType.name === "Tickets/Notice to Contest"
          ? this.caseTrafficCharges[0].trafficCharge.penalty
          : this.penalty;
      order.fwTimePeriod = this.taValue + " " + this.selectedTimeUnit.value.name;
      order.fwTimeUnit = this.selectedTimeUnit.value.name;
      order.fwTimeValue = this.taValue;
      order.fwDefaultTerms = this.defaultTerm
        ? this.defaultTerm.value.name
        : null;

        order.taDueDate = this.taDueDate ? this.taDueDate : null;

    }
    
    if (order.orderType === "Community Service") {


      order.csHours = this.csHours ? this.csHours : null;
      order.csLocation = this.csLocation ? this.csLocation : null;
      order.csStartDate = this.csStartDate ? this.csStartDate : null;

      order.fwFineAmount = 0;
      order.fwDefaultTerms = "Community Service";
      order.fwTimePeriod = this.csHours.toString() + " hours";
      order.fwTimeUnit = "hours";
      order.fwTimeValue = order.csHours;

    }
    
    if (order.orderType === "Bonded") {

      order.bdTimePeriod =
        this.bdValue + " " + this.selectedTimeUnit.value.name;
      order.bdTimeUnit = this.selectedTimeUnit.value.name;
      order.bdTimeValue = this.bdValue;
      order.bondAmount = this.bondAmount ? this.bondAmount : null;

      order.fwFineAmount = this.bondAmount ? this.bondAmount : null;
      order.fwDefaultTerms = "Bonded";
      order.fwTimePeriod = this.bdValue + " " + this.selectedTimeUnit.value.name;
      order.fwTimeUnit = this.selectedTimeUnit.value.name;
      order.fwTimeValue = this.bdValue;

    } 
    
    if (order.outcome === "Not Liable" && order.orderType === "Dismissed") {
      order.demeritPoints = 0;
    } 

    if (order.outcome === "Liable" && order.orderType === "Dismissed") {
      
      order.demeritPoints = 0;
      order.fwFineAmount = 0;
      order.fwDefaultTerms = "Dismissed";
      order.fwTimePeriod =  "0 hours";
      order.fwTimeUnit = "hours";
      order.fwTimeValue = 0;  

    }     
    
    if (order.orderType === "Probation") {

      order.pbTimePeriod = this.pbValue + " " + this.selectedTimeUnit.value.name;
      order.pbTimeUnit = this.selectedTimeUnit.value.name;
      order.pbTimeValue = this.pbValue;   
      order.pbFrequency = this.pbFrequency ? this.pbFrequency : null;
      order.pbTimes = this.pbTimes ? this.pbTimes : null;

      order.fwFineAmount = 0;
      order.fwDefaultTerms = "Probation";
      order.fwTimePeriod =  this.pbValue + " " + this.selectedTimeUnit.value.name;
      order.fwTimeUnit = this.selectedTimeUnit.value.name;
      order.fwTimeValue = this.pbValue;

      console.log('Sending Order Type: Probation');
    } 
    
    if (order.orderType === "Compensation") {


      order.compTimePeriod = this.compTimePeriod;
      order.compDefaultTerms = this.defaultTerm? this.defaultTerm.value.name: null;
      order.compAmount = this.compAmount ? this.compAmount : null;

      order.fwFineAmount = this.compAmount ? this.compAmount : null;
      order.fwDefaultTerms = this.defaultTerm? this.defaultTerm.value.name: null;
      order.fwTimePeriod =  this.compTimePeriod;

    } 
    
    if (order.orderType === "License Suspended") {

      order.disqualified = this.selectedTemplate.name === "License Suspended" ? true : false;
      order.dqStartDate = this.dqStartDate ? this.dqStartDate : null;
      order.dqTimePeriod =
        this.dqValue + " " + this.selectedTimeUnit.value.name;

      order.dqTimeUnit = this.selectedTimeUnit.value.name;
		  order.dqTimeValue = this.dqValue;

      order.fwFineAmount = 0;
      order.fwDefaultTerms = "License Suspended";
      order.fwTimePeriod = this.dqValue + " " + this.selectedTimeUnit.value.name;
      order.fwTimeUnit = this.selectedTimeUnit.value.name;
      order.fwTimeValue = this.dqValue;     
    } 
    
    if (order.orderType === "License Revoked") {
      order.revoked =
        this.selectedTemplate.name === "License Revoked" ? true : false;
      order.rvStartDate = this.rvStartDate ? this.rvStartDate : null;

      order.dqTimeUnit = 'months';
		  order.dqTimeValue = 999;

      order.fwFineAmount = 0;
      order.fwDefaultTerms = "License Revoked";
      order.fwTimePeriod = "999 months";
      order.fwTimeUnit = "months";
      order.fwTimeValue = 999;

    }

    if (order.orderType === "Reprimanded and Discharged") {
      
      order.fwFineAmount = 0;
      order.fwDefaultTerms = "Reprimanded and Discharged";
      order.fwTimePeriod = "0 months";
      order.fwTimeUnit = "months";
      order.fwTimeValue = 0;

    }
    
    // console.log('Order Passed to Registry ', order);

    //#region Register Entry
    // register entry save
    const regEntry: RegisterEntry = new RegisterEntry();
    if (this.isEdit) {
      regEntry.description = "Order updated!";
    } else {
      regEntry.description =
        order.orderType + " order created. " + JSON.stringify(order);
    }

    regEntry.caseOID = (this.case.caseOID as any) as string;
    regEntry.eventTypeName = "UPTD";

    this.caseRegSvc.save(regEntry).subscribe(
      (result) => {
        this.updateRegister();
      },
      (error) => {
        console.log(error);
      },
      () => {
        // final
      }
    );

    //#endregion

        this.orderSvc.save(order).subscribe(
      (result) => {
        this.getOrders(result);
        this.toastSvc.showSuccessMessage("Order Component Saved");
      },
      (error) => {
        console.log(error);
        this.toastSvc.showErrorMessage(
          "There was an error while saving orders."
        );
      },
      () => {
        // final
      }
    );
    this.hideModal();
    form.reset();
  }  

  getOrders(resultOrder?) {
    this.loadingDataFlag = true;
    this.orderSvc.getOrdersByOffence(resultOrder.caseNumber).subscribe(
      (data) => {
        this.orders = data;
        this.orders = this.orders.slice();
      },
      (error) => {
        console.log("getOrder error", error);
        this.toastSvc.showErrorMessage("There was an error fetching orders.");
      },
      () => {
        this.loadingDataFlag = false;
      }
    );
  }

  confirm1(id) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to send this order to UTURN?",
      header: "Confirmation",
      icon: "fa fa-question-circle",
      accept: () => {
        /*
        
        this.msgs = [
          {
            severity: "primary",
            summary: "Confirmed",
            detail: "Order sent to UTURN successfully"
          }
        ]; */

        const order = this.compileOrder(id);
        this.sendOrder(order);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Rejected",
            detail: "You declined sending the request",
          },
        ];
      },
    });
  }

  compileOrder(id): any {
    const order: any = new Object();

    // console.log(this.case.caseParties);
    let role = "";
    if (this.case.caseType.name === "Tickets/Notice to Contest") {
      role = "Applicant";
    } else if (this.case.caseType.name === "Private Complaint") {
      role = "Defendant";
    } else {
      role = "Accused";
    }

    // needs to be changed to be more general

    const applicant = this.case.caseParties.find((x) => x.role.name === role);
    // console.log(applicant);
    this.partySvc
      .fetchOne(applicant.caseParty.partyOID.toString())
      .subscribe((result) => {
        this.fullApplicant = result;
        // console.log(this.fullApplicant);

        //#region Driver
        order.driverFullName = this.fullApplicant.fullName;
        order.driverLastName = this.fullApplicant.lastName;
        order.driverFirstName = this.fullApplicant.firstName;

        const firstSpace = this.fullApplicant.fullName.indexOf(" ");
        const lastSpace = this.fullApplicant.fullName.lastIndexOf(" ");
        if (firstSpace !== lastSpace) {
          order.driverMiddleName = this.fullApplicant.fullName.substring(
            firstSpace,
            lastSpace
          );
        }

        //#endregion

        order.caseNumber = this.case.caseNumber;

        if (this.fullApplicant.addresses) {
          this.applicantAddress = this.fullApplicant.addresses.find(
            (x) => x.addressType === "Primary"
          );
        }

        this.applicantDP = this.fullApplicant.identifiers.find(
          (x) => x.identifierType === "Driver Permit Number"
        );

        //#region Address
        if (this.applicantAddress) {
          if (this.applicantAddress.address1 != null) {
            order.driverAddressLine1 = this.applicantAddress.address1;
            order.driverFullAddress = order.driverAddressLine1;
          }
          if (this.applicantAddress.address2 != null) {
            order.driverAddressLine2 = this.applicantAddress.address2;
            order.driverFullAddress += ", " + order.driverAddressLine2;
          }
          if (this.applicantAddress.address3 != null) {
            order.driverAddressLine3 = this.applicantAddress.address3;
            order.driverFullAddress += ", " + order.driverAddressLine3;
          }
          if (
            this.applicantAddress.municipalityName &&
            this.applicantAddress.address3 == null
          ) {
            order.driverAddressLine3 = this.applicantAddress.municipalityName;
            order.driverFullAddress += ", " + order.driverAddressLine3;
          } else if (
            this.applicantAddress.municipalityName &&
            this.applicantAddress.address3 != null
          ) {
            order.driverAddressLine3 +=
              ", " + this.applicantAddress.municipalityName;
            order.driverFullAddress += ", " + order.driverAddressLine3;
          }
        }

        //#endregion

// TODO: Remove
order.driverPermit = "123123"

        // order.driverPermit =
        //   this.case.caseType.name === "Tickets/Notice to Contest"
        //     ? this.applicantDP.identifierValue
        //     : null;
      });

    this.orders.forEach((element) => {
      for (const [key, value] of Object.entries(element)) {
        if (value !== null && key !== "id" && key !== "outcome") {
          // console.log(key + ':' + value);
          order[key] = value;
        }
      }
    });

    // order.liable = order.outcome === "Liable" ? true : false;

    if (this.orders[0].outcome === "Liable") {
      
      order.liable = true

      if(this.orders[0].orderType === "License Suspended" || this.orders[0].orderType === "License Revoked"){
        console.log('License Suspended/Revoked Order Compiled');
        order.disqualificationPeriodUnit = this.orders[0].dqTimeUnit;
        order.disqualificationPeriodValue = this.orders[0].dqTimeValue;
      }

    }
    else order.liable = false;

    //order.liable = order.outcome === "Liable" ? true : false;

    console.log('The customer liability status', order.liable);
    console.log('Compile Order: disqualificationPeriodUnit ', order.disqualificationPeriodUnit);
    console.log('Compile Order: disqualificationPeriodValue ', order.disqualificationPeriodValue);    

    order.offenceName =
      this.case.caseType.name === "Tickets/Notice to Contest"
        ? this.caseTrafficCharges[0].trafficCharge.description
        : null;
    // console.log(order);

    order.id = id;
    return order;
  }

  sendOrder(order: Order) {
    this.orderSvc.send(order).subscribe(
      (data) => {
        console.log(data);

        if (data.error == 1) {
          this.toastSvc.showWarnMessage(
            "There was an error sending the order, please retry shortly"
          );

          let EregEntry: RegisterEntry = new RegisterEntry();

          EregEntry.description =
            "There was an error sending the order - " + JSON.stringify(data);

          EregEntry.caseOID = (this.case.caseOID as any) as string;
          EregEntry.eventTypeName = "UPTD";

          this.caseRegSvc.save(EregEntry).subscribe(
            (result) => {
              this.updateRegister();
            },
            (error) => {
              console.log(error);
            },
            () => {
              // final
            }
          );
        } else {
          this.toastSvc.showInfoMessage("Order sent successfully");

          let EregEntry: RegisterEntry = new RegisterEntry();

          EregEntry.description =
            "Order sent to uturn! " + JSON.stringify(data);

          EregEntry.caseOID = (this.case.caseOID as any) as string;
          EregEntry.eventTypeName = "UPTD";

          this.caseRegSvc.save(EregEntry).subscribe(
            (result) => {
              this.updateRegister();
            },
            (error) => {
              console.log(error);
            },
            () => {
              // final
            }
          );
        }
      },
      (error) => {
        this.toastSvc.showWarnMessage(
          "There was an error sending the order, please retry shortly"
        );
        let EregEntry: RegisterEntry = new RegisterEntry();

        EregEntry.description =
          "There was an unknown connection error sending the order";

        EregEntry.caseOID = (this.case.caseOID as any) as string;
        EregEntry.eventTypeName = "UPTD";

        this.caseRegSvc.save(EregEntry).subscribe(
          (result) => {
            this.updateRegister();
          },
          (error) => {
            console.log(error);
          },
          () => {
            // final
          }
        );
      },
      () => {}
    );

    //#region Register Entry
    // register entry save
    const regEntry: RegisterEntry = new RegisterEntry();

    regEntry.description = "Order sent to uturn! " + JSON.stringify(order);

    regEntry.caseOID = (this.case.caseOID as any) as string;
    regEntry.eventTypeName = "UPTD";

    this.caseRegSvc.save(regEntry).subscribe(
      (result) => {
        this.updateRegister();
      },
      (error) => {
        console.log(error);
      },
      () => {
        // final
      }
    );

    //#endregion
  }

  hideModal() {
    this.showModalAddOrder = false;
  }
}
