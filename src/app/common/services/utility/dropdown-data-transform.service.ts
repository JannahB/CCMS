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

  /*
    This supports case where label must include two fields for easier searching
  */
  public transformConcatTwoLabels<T>
  (
    data:T[],
    labelField1:string = "description",
    labelField2:string = "name",
    delimiter:string = ':',
    dataField:string = "id"
  ):SelectItem[]{
    if(!data){
      return null;
    }

    return data.map(item => {
      return {
        label: item[labelField1] + delimiter + item[labelField2],
        value: item[dataField]
      }
    });
  }

}
