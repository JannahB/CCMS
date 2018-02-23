import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { LookupService } from './../../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AdminDataService } from '../../../common/services/http/admin-data.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { CaseStatus } from './../../../common/entities/CaseStatus';

@Component({
  selector: 'app-case-statuses',
  templateUrl: './case-statuses.component.html',
  styles: [
    `
    h2 {
      font-weight: 300;
      text-transform: uppercase;
    }

    `
  ]
})
export class CaseStatusesComponent implements OnInit {

  typeItems: CaseStatus[];
  selectedItem: CaseStatus;
  tableLabel:string = "Case Status"
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

    // Handle selection change via dom element so we can DeselectAll
    this.itemsList.selectionChange.subscribe((event: MatSelectionListChange) => {
      this.itemsList.deselectAll();
      event.option.selected = true;
      this.selectedItem = event.option.value;
    });

  }

  ngOnDestroy() {
    if(this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }

  getRefData() {
    this.refDataSubscription = this.lookupSvc.fetchLookup<CaseStatus>('FetchCaseStatus').subscribe(result => {
      this.typeItems = result;
      this.selectedItem = this.typeItems[0];
      setTimeout(() => {
        this.itemsList.options.first.selected = true;
      }, 100);

    })
  }

  onSelectionChange(event) {
    // Handling selection change with MatSelectionListChange observable above
    // this.selectedItem = event.option.value[0];
  }

  createNewItem() {
    this.selectedItem = new CaseStatus();
  }

  saveDataItem(){
    this.adminSvc.saveCaseStatus(this.selectedItem).subscribe( result => {
      console.log('result', result);

      let index:number = this.typeItems
        .findIndex(itm => itm.statusOID == result.statusOID);

      if(index >= 0){
        this.typeItems[index] = result;
      }else{
        this.typeItems.push(result);
      }
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
