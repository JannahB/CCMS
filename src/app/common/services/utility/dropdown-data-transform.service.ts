import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

@Injectable()
export class DropdownDataTransformService {

  public transform<T>(data:T[], labelField:string = "name", dataField:string = "id"):SelectItem[]{
    if(!data){
      return null;
    }

    return data.map(item => {
      return {
        label: item[labelField],
        value: item[dataField]
      }
    });
  }

  /*
    This supports case where parent object value is the label and no ID is present
    Like a list of objects with just one value. Ex:countries { name:"United State"}, {name:"United Kingdom"}, ...
  */
  public transformSameLabelAndValue<T>(data:T[], labelField:string = "name"):SelectItem[]{
    if(!data){
      return null;
    }

    return data.map(item => {
      return {
        label: item[labelField],
        value: item[labelField]
      }
    });
  }

}
