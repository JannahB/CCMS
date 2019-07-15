import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { StaffPool } from './../../../common/entities/StaffPool';
import { LookupService } from './../../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AdminDataService } from '../../../common/services/http/admin-data.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-staff-pool',
  templateUrl: './staff-pool.component.html',
  styles: [
    `
    h2 {
      font-weight: 300;
      text-transform: uppercase;
    }

    `
  ]
})

export class StaffPoolComponent implements OnInit, OnDestroy, AfterViewInit {

  typeItems: StaffPool[];
  selectedItem: StaffPool;

  allowDeleteLookupItems: boolean;
  selectedItemIdx: number;
  selectedItemBak: StaffPool;
  showDeleteItemModal = false;

  tableLabel = 'Staff Pool';
  refDataSubscription: Subscription;

  constructor(
    private breadCrumbSvc: BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Data Table Maintenance', routerLink: ['/admin/data'] },
      { label: 'Staff Pools', routerLink: ['/admin/data/staffpools'] }
    ]);
  }

  @ViewChild(MatSelectionList) itemsList: MatSelectionList;

  ngOnInit() {
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
    if (this.refDataSubscription) {
      this.refDataSubscription.unsubscribe();
    }
  }


  getRefData() {
    this.refDataSubscription = this.lookupSvc.fetchLookup<StaffPool>('api/staff-pools').subscribe(result => {
      this.typeItems = result;
      this.selectedItem = this.typeItems[0];
      this.copySelectedItem();
      // If items in list, default to first item
      setTimeout(() => {
        if (this.itemsList.options.first) {
          this.itemsList.options.first.selected = true;
        }
      }, 100);

    });
  }

  onSelectionChange(event) {
    // Handling selection change with MatSelectionListChange observable above
    // this.selectedItem = event.option.value[0];
  }

  createNewItem() {
    this.itemsList.deselectAll();
    this.selectedItem = new StaffPool();
    this.copySelectedItem();
  }

  saveDataItem() {
    this.adminSvc.saveStaffPool(this.selectedItem).subscribe(result => {
      if (result instanceof Array) {
        result.forEach(staffPool => {
          const index: number = this.getIndexOfItem(staffPool);
          if (index >= 0) {
            this.typeItems[index] = staffPool;
          } else {
            this.selectedItem = staffPool;
            this.copySelectedItem();
            this.typeItems.push(this.selectedItem);
          }
        });
      } else {
      }
      this.toastSvc.showSuccessMessage('Item Saved');
    },
      (error) => {
        console.log(error);
        this.toastSvc.showErrorMessage('There was an error saving the item.');
      },
      () => {
        // final
      });

  }

  copySelectedItem() {
    this.selectedItemBak = Object.assign(new StaffPool(), this.selectedItem);
    this.selectedItemIdx = this.getIndexOfItem(this.selectedItem);
  }

  cancelDataItemEdit(event) {
    this.selectedItem = Object.assign(new StaffPool(), this.selectedItemBak);
    this.typeItems[this.selectedItemIdx] = this.selectedItem;
  }

  deleteDataItemRequest() {
    if (!this.allowDeleteLookupItems) {
      this.toastSvc.showInfoMessage('Delete support is currently not available.');
      return;
    }
    this.showDeleteItemModal = true;
  }

  deleteDataItem() {
    this.adminSvc.deleteLookupItem('StaffPool', this.selectedItem.poolOID).subscribe(result => {
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
      });
  }

  hideModals() {
    this.showDeleteItemModal = false;
  }

  private getIndexOfItem(item = this.selectedItem): number {
    return this.typeItems
      .findIndex(itm => itm.poolOID === item.poolOID);
  }


}
