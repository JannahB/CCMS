import { Pipe, PipeTransform } from "@angular/core";
import { NamedEntity } from "../interfaces/named-entity";

@Pipe({ name: "nameFilter" })
export class NameFilterPipe implements PipeTransform {
  transform(items: NamedEntity[], filterText: string): NamedEntity[] {
    if (!items) {
      return [];
    }

    if (!filterText) {
      return items;
    }

    return items.filter(n => n.name && n.name.contains(filterText));
  }
}
