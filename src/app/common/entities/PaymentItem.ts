export class PaymentItem {

  private _id: number;
  private _paymentItemOID: number;

  name: string;
  shortName: string;
  description: string;
  courtOID: number;

  public get id(): number {
    return this._id;
  }

  public set id(value: number){
      this._id = value;
      this._paymentItemOID = value;
  }

  public get paymentItemOID(): number {
    return this._paymentItemOID;
  }

  public set paymentItemOID(value: number){
      this._paymentItemOID = value;
      this._id = value;
  }

}
