/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

//Joe's typings
interface Array<T>{
  remove(element:T):void;
  removeIndex(index:number):void;
  contains(item:T):boolean;
  last():T;
  first():T;
  any():boolean;
  copy():Array<T>;
}

interface Number{
  round(decimalPoints:number):number;
}

interface String{
  contains(value:string):boolean;
  contains(value:string, caseSensitive:boolean):boolean;
}

interface Date{
format (mask:string, utc:boolean):string;
toUTC():Date;
toServerUTC():Date;
toUTCDateOnly():Date;
addDays(days:number):Date;
}
