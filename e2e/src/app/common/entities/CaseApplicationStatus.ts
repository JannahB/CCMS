export class CaseApplicationStatus {

  private _id: number;
  private _caseApplicationStatusOID: number;
  name: string;
  shortName: string;
  description: string;
  courtOID: number;

  public get id():number {
    return  this._id;
  }
  public set id(value:number){
      this._id = value;
      this._caseApplicationStatusOID = value;
  }

  public get caseApplicationStatusOID():number {
    return  this._caseApplicationStatusOID;
  }
  public set caseApplicationStatusOID(value:number){
      this._caseApplicationStatusOID = value;
      this._id = value;
  }

}
