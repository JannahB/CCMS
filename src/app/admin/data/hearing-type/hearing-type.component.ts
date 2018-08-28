import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { LookupService } from '../../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AdminDataService } from '../../../common/services/http/admin-data.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { environment } from '../../../../environments/environment';
import { HearingType } from '../../../common/entities/HearingType';

@Component({
  selector: 'app-hearing-type',
  templateUrl: './hearing-type.component.html',
  styles: [
    `
    h2 {
      font-weight: 300;
      text-transform: uppercase;
    }

    `
  ]
})
export class HearingTypeComponent implements OnInit {

  typeItems: HearingType[];
  selectedItem: HearingType;

  allowDeleteLookupItems: boolean;
  selectedItemIdx: number;
  selectedItemBak: HearingType;
  showDeleteItemModal: boolean = false;

  eventCategories: any[];
  tableLabel:string = "Hearing Type"
  refDataSubscription: Subscription;


  constructor(
    private breadCrumbSvc:BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Data Table Maintenance', routerLink: ['/admin/data'] },
      { label: 'Hearing Types', routerLink: ['/admin/data/hearingtypes'] }
    ]);
   }

  @ViewChild(MatSelectionList) itemsList: MatSelectionList;

  ngOnInit(){
    this.allowDeleteLookupItems = environment.allowDeleteLookupItems;
  }

  ngAfterViewInit() {

    this.getRefData();

    // Handle selection change via dom element so we can DeselectAll
    this.itemsList.selectionChange.subscribe((event: MatSelectionListChange) => {
      this.itemsList.deselectAll();
      event.option.selected = true;
      this.selectedItem = event.option.value;
      this.copySelectedItem();
    });

  }

  ngOnDestroy() {
    if(this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }


  getRefData() {
    this.refDataSubscription = this.adminSvc.fetchLookup<HearingType>('FetchHearingType')
      .subscribe(result => {
        this.typeItems = result;
        this.selectedItem = this.typeItems[0];
        this.copySelectedItem();

        // If items in list, default to first item
        setTimeout(() => {
          if( this.itemsList.options.first )
            this.itemsList.options.first.selected = true;
        }, 100);

    })
  }

  createNewItem() {
    this.itemsList.deselectAll();
    this.selectedItem = new HearingType();
    this.copySelectedItem();
  }

  saveDataItem(){
    this.adminSvc.saveHearingType(this.selectedItem).subscribe( result => {
      console.log('result', result);

      let index:number = this.getIndexOfItem(result);

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

  copySelectedItem() {
    this.selectedItemBak = Object.assign( new HearingType(), this.selectedItem );
    this.selectedItemIdx = this.getIndexOfItem(this.selectedItem);
  }

  cancelDataItemEdit(event) {
    this.selectedItem = Object.assign( new HearingType(), this.selectedItemBak );
    this.typeItems[this.selectedItemIdx] = this.selectedItem;
  }

  deleteDataItemRequest() {
    if(!this.allowDeleteLookupItems) {
      this.toastSvc.showInfoMessage('Delete support is currently not available.');
      return;
    }
    this.showDeleteItemModal = true;
  }

  deleteDataItem() {
    this.adminSvc.deleteLookupItem('CaseType', this.selectedItem.hearingTypeOID).subscribe( result => {
      this.typeItems.splice(this.getIndexOfItem(), 1);
      this.selectedItem = this.typeItems[0];
      this.toastSvc.showSuccessMessage('The item has been deleted.');
    },
    (error) => {
      console.log(error);
      this.toastSvc.showErrorMessage('There was an error deleting the item.');
    },
    () => {
      // final
    })
  }

  hideModals(){
    this.showDeleteItemModal = false;
  }

  private getIndexOfItem(item = this.selectedItem): number {
    return this.typeItems
        .findIndex(itm => itm.hearingTypeOID == item.hearingTypeOID);
  }

}


