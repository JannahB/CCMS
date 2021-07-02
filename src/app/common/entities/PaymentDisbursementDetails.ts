export class PaymentDisbursementDetails {

    //These variables are sent to the server
    courtID: number = 0;
    caseOID: number = 0;
    paymentOID: number = 0; //unique identifier for the parent payment
    paymentDetailOID: number = 0; // unique identifier for payment details associate with a payment
    paymentItemOID: number = 0;
    timeFrequencyOID: string = "";
    paymentPeriodStartDate: Date = null;
    paymentPeriodEndDate: Date = null;
    paymentAmountOrdered: number;
    paymentAmountIn: number;
    paymentDate: Date = null;
    paymentType: string = "";
    receiptNumber: string = "";

}
