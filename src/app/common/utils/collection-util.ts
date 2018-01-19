export class CollectionUtil{
    public static removeArrayItem<T>(array:T[], item:T):void{
        let index = array.indexOf(item);
        
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}