import { CasePhase } from "./CasePhase";


export class CaseType {

  private _id: number;
  private _caseTypeOID: number;
  name: string;
  shortName: string;
  description: string;
  casePhases: CasePhase[];
  courtOID: number;

  public get id():number {
    return  this._id;
  }
  public set id(value:number){
      this._id = value;
      this._caseTypeOID = value;
  }

  public get caseTypeOID():number {
    return  this._caseTypeOID;
  }
  public set caseTypeOID(value:number){
      this._caseTypeOID = value;
      this._id = value;
  }

}
