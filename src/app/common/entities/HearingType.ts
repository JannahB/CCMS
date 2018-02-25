
export class HearingType {

  private _id: number;
  private _hearingTypeOID: number;
  private _name: string;
  private _hearingName: string;
  durationInMinutes: number;
  courtOID: number;
  description: string;


  hearingTypeOID: number;

  public get id():number {
      return  this._id;
  }
  public set id(value:number){
      this._id = value;
      this._hearingTypeOID = value;
  }

  // public get hearingTypeOID():number{
  //   return  this._hearingTypeOID;
  // }
  // public set hearingTypeOID(value:number){
  //     this._hearingTypeOID = value;
  //     this._id = value;
  // }

  public get name():string{
      return  this._name;
  }
  public set name(value:string){
      this._name = value;
      this._hearingName = value;
  }

  public get hearingName():string{
    return  this._hearingName;
  }
  public set hearingName(value:string){
      this._hearingName = value;
      this._name = value;
  }


}
