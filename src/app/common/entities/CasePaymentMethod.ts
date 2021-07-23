export class CasePaymentMethod {

    private _id: number;
    private _casePaymentMethodOID: number;
    name: string;
    description: string;
    courtOID: number;

    public get id():number{
        return this._id;
    }

    public set id(value:number){
        this._id = value;
        this._casePaymentMethodOID = value;
    }

    public get casePaymentMethodOID():number{
        return this._casePaymentMethodOID;
    }

    public set casePaymentMethodOID(value:number){
        this._casePaymentMethodOID = value;
        this._id = value;
    }
}