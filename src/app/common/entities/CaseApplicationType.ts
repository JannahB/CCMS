export class CaseApplicationType {

  private _id: number;
  private _caseApplicationTypeOID: number;
  name: string;
  shortName: string;
  description: string;
  courtOID: number;

  public get id():number {
    return  this._id;
  }
  public set id(value:number){
      this._id = value;
      this._caseApplicationTypeOID = value;
  }

  public get caseTypeApplicationOID():number {
    return  this._caseApplicationTypeOID;
  }
  public set caseTypeApplicationOID(value:number){
      this._caseApplicationTypeOID = value;
      this._id = value;
  }

}
