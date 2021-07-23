export class CasePaymentType {

    private _id: number;
    private _casePaymentTypeOID: number;
    name: string;
    description: string;
    courtOID: number;

    public get id():number{
        return this._id;
    }

    public set id(value:number){
        this._id = value;
        this._casePaymentTypeOID = value;
    }

    public get casePaymentTypeOID():number{
        return this._casePaymentTypeOID;
    }

    public set casePaymentTypeOID(value:number){
        this._casePaymentTypeOID = value;
        this._id = value;
    }
}