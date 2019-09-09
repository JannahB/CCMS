export class PaymentDisbursementDetails {
    
    //These variables are sent to the server
    courtID: number = 0;
    caseOID: number = 0;
    paymentOID: number = 0; //unique identifier for the parent payment
    paymentDetailOID: number = 0; // unique identifier for payment details associate with a payment
    paymentItem: string = "";
    paymentFrequency: string = "";
    paymentPeriodStartDate: Date = null;
    paymentPeriodEndDate: Date = null;
    paymentAmountOrdered: number = 0;
    paymentAmountIn: number = 0;
    paymentAmountOut: number = 0; // This is hiddent if it's a new application
   
 }