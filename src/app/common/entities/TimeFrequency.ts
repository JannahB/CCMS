export class TimeFrequency {

  private _id: number;
  private _paymentFrequencyOID: number;

  name: string;
  shortName: string;
  description: string;
  courtOID: number;

  public get id(): number {
    return this._id;
  }

  public set id(value: number){
      this._id = value;
      this._paymentFrequencyOID = value;
  }

  public get paymentFrequencyOID(): number {
    return this._paymentFrequencyOID;
  }

  public set paymentFrequencyOID(value: number){
      this._paymentFrequencyOID = value;
      this._id = value;
  }

}
