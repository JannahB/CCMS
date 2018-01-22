import { Injectable } from "@angular/core";

@Injectable()
export class LocalStorageService{
    
    public prefix:string = "tnt-";
    private storage:Storage = localStorage;

    constructor(){

    }

    public setValue<T>(key:string, value:T):void{
        let serializedValue:string = JSON.stringify(value);
        let prefixedKey:string = this.getPrefixedKey(key);

        this.storage.setItem(prefixedKey, serializedValue);
    }

    public getValue<T>(key:string):T{
        let prefixedKey:string = this.getPrefixedKey(key);
        let serializedValue:string = this.storage.getItem(prefixedKey);

        return JSON.parse(serializedValue) as T;
    }

    public hasValue(key:string):boolean{
        let prefixedKey:string = this.getPrefixedKey(key);
        let serializedValue:string = this.storage.getItem(prefixedKey);

        return serializedValue != null;
    }

    private getPrefixedKey(key:string):string{
        return this.prefix + key;
    }

}