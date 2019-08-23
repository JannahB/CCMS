export class CollectionUtil {
  public static removeArrayItem<T>(array: T[], item: T): void {
    let index = array.indexOf(item);

    if (index > -1) {
      array.splice(index, 1);
    }
  }

  public static convertToString(altNames: String[]): string {
    if (altNames == undefined) {
      return "";
    }
    const nameString = altNames.toString();
    return nameString;
  }

  public static convertToArray(altNames: String): string[] {
    const nameArr = altNames.split(',');
    return nameArr;
  }
}
