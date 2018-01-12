export class ParseException extends Error{

    private _stringToParse:string;

    public get stringToParse():string{
        return this._stringToParse;
    }

    constructor(message, stringToParse:string){
        super(message);
        this._stringToParse = stringToParse;
    }

}