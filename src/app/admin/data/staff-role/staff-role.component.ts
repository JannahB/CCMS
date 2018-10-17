import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatSelectionList, MatSelectionListChange, MatOption, MatListOption, SELECT_PANEL_INDENT_PADDING_X } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { LookupService } from './../../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AdminDataService } from '../../../common/services/http/admin-data.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { environment } from './../../../../environments/environment';
import { StaffRole } from './../../../common/entities/StaffRole';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-staff-role',
  templateUrl: './staff-role.component.html',
  styles: [
    `
    h2 {
      font-weight: 300;
      text-transform: uppercase;
    }

    `
  ]
})
export class StaffRoleComponent implements OnInit, AfterViewInit {


  typeItems: StaffRole[];
  selectedItem: StaffRole;

  allowDeleteLookupItems: boolean;
  selectedItemIdx: number;
  selectedItemBak: StaffRole;
  showDeleteItemModal: boolean = false;

  tableLabel: string = "Staff Role"
  refDataSubscription: Subscription;

  constructor(
    private breadCrumbSvc: BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Data Table Maintenance', routerLink: ['/admin/data'] },
      { label: 'Staff Role', routerLink: ['/admin/data/staffroles'] }
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
    if (this.refDataSubscription) this.refDataSubscription.unsubscribe();
  }


  getRefData() {
    this.refDataSubscription = this.lookupSvc.fetchLookup<StaffRole>('FetchStaffRole')
      .subscribe(result => {
        this.typeItems = result;
        this.selectedItem = this.typeItems[0];
        this.copySelectedItem();

        // If items in list, default to first item
        setTimeout(() => {
          if (this.itemsList.options.first)
            this.itemsList.options.first.selected = true;
        }, 100);

      })
  }

  createNewItem() {
    this.itemsList.deselectAll();
    this.selectedItem = new StaffRole();
    this.copySelectedItem();
  }

  saveDataItem() {
    this.adminSvc.saveStaffRole(this.selectedItem).subscribe(response => {
      if (response instanceof Array) {
        response.forEach(elemStaffRole => {
          let index: number = this.getIndexOfItem(elemStaffRole);

          if (index >= 0) {
            this.typeItems[index] = elemStaffRole;
            console.log("elemStaffRole updated!");
          } else {            
            this.selectedItem=elemStaffRole;
            this.copySelectedItem();
            this.typeItems.push(this.selectedItem);
            console.log("elemStaffRole added!");
          }          
        });
      } else {
        //console.warn("single entry, expected array");
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
    this.selectedItemBak = Object.assign(new StaffRole(), this.selectedItem);
    this.selectedItemIdx = this.getIndexOfItem(this.selectedItem);
  }

  cancelDataItemEdit(event) {
    this.selectedItem = Object.assign(new StaffRole(), this.selectedItemBak);
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
    this.adminSvc.deleteLookupItem('StaffRole', this.selectedItem.staffRoleOID).subscribe(result => {
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


  hideModals() {
    this.showDeleteItemModal = false;
  }

  private getIndexOfItem(item = this.selectedItem): number {
    return this.typeItems
      .findIndex(itm => itm.staffRoleOID == item.staffRoleOID);
  }

}

