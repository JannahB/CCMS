import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'idToName' })
export class ReferenceDataIdToNamePipe implements PipeTransform {

    transform(id: string | number, referenceDataCollection: any[], idPropertyName: string = 'id', labelPropertyName: string = 'name') {
        if (!referenceDataCollection) {
            return '';
        }

        const referenceItem: any = referenceDataCollection.find(data => data[idPropertyName] === id);

        if (!referenceItem) {
            return '';
        }

        return referenceItem[labelPropertyName];
    }

}
