import { CaseType } from './../../../common/entities/CaseType';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { LookupService } from './../../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AdminDataService } from '../../../common/services/http/admin-data.service';
import { ToastService } from '../../../common/services/utility/toast.service';

@Component({
  selector: 'app-case-types',
  templateUrl: './case-types.component.html',
  styleUrls: ['./case-types.component.scss']
})
export class CaseTypesComponent implements OnInit {

  typeItems: CaseType[];
  selectedItem: CaseType;
  tableLabel:string = "Case Type"
  refDataSubscription: Subscription;

  constructor(
    private breadCrumbSvc:BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) { }

  @ViewChild(MatSelectionList) itemsList: MatSelectionList;

  ngOnInit(){


  }

  ngAfterViewInit() {
    this.getRefData();
    this.itemsList.selectionChange.subscribe((event: MatSelectionListChange) => {
      this.itemsList.deselectAll();
      event.option.selected = true;
      this.selectedItem = event.option.value;
    });

  }

  ngOnDestroy() {

  }


  getRefData() {
    let that = this;
    this.lookupSvc.fetchLookup<CaseType>('FetchCaseType').subscribe(result => {
      this.typeItems = result;
      this.selectedItem = this.typeItems[0];
      setTimeout(() => {
        that.itemsList.options.first.selected = true;
      }, 100);

    })
  }

  onSelectionChange(event) {
    console.log(event);
    // this.selectedItem = event.option.value[0];
  }

  createNewItem() {
    this.selectedItem = new CaseType();
  }

  saveDataItem(){
    this.adminSvc.saveCaseType(this.selectedItem).subscribe( result => {
      console.log('result', result);

      let index:number = this.typeItems
        .findIndex(itm => itm.caseTypeOID == result.caseTypeOID);

      if(index >= 0){
        this.typeItems[index] = result;
      }else{
        this.typeItems.push(result);
        // this.typeItems = this.typeItems.slice();
      }
      // this.refreshList();
      this.toastSvc.showSuccessMessage('Item Saved');
    },
    (error) => {
      console.log(error);
      this.toastSvc.showErrorMessage('There was an error saving the item.');
    },
    () => {
      // final
    })

  }


}
