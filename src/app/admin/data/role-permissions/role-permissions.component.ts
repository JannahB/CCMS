import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatSelectionList, MatSelectionListChange, MatOption, MatListOption, SELECT_PANEL_INDENT_PADDING_X } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { LookupService } from './../../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AdminDataService } from '../../../common/services/http/admin-data.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { environment } from './../../../../environments/environment';
import { StaffRole } from './../../../common/entities/StaffRole';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { setTimeout } from 'timers';
import { Permission } from '../../../common/entities/Permission';
import { RolePermissionCheckable } from '../../../common/entities/RolePermissionCheckable';
import { StaffRolePermission } from '../../../common/entities/StaffRolePermission';

@Component({
  selector: 'app-role-permissions',
  templateUrl: './role-permissions.component.html',
  styles: [
    `
    h2 {
      font-weight: 300;
      text-transform: uppercase;
    }

    `
  ]
})
export class RolePermissions implements OnInit, AfterViewInit {

  allPerms: Permission[];
  checkablePerms: RolePermissionCheckable[];
  typeItems: StaffRolePermission[];
  selectedItem: StaffRolePermission;

  allowDeleteLookupItems: boolean;
  selectedItemIdx: number;
  selectedItemBak: StaffRolePermission;
  showDeleteItemModal: boolean = false;

  tableLabel: string = "Role Permissions"
  refDataSubscription: Subscription;

  constructor(
    private breadCrumbSvc: BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Data Table Maintenance', routerLink: ['/admin/data'] },
      { label: 'Role Permissions', routerLink: ['/admin/data/rolepermissions'] }
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
    this.refDataSubscription = this.lookupSvc.fetchLookup<Permission>('FetchPermission')
      .subscribe(result => {
        this.checkablePerms = []; //clear in case refresh
        this.allPerms = result;
        this.allPerms.forEach(perm => {
          let rolePC: RolePermissionCheckable = new RolePermissionCheckable();
          rolePC.permission = perm;
          rolePC.checked = false;
          this.checkablePerms.push(rolePC);
        });
        this.getStaffRoleRefData();
      })
  }

  getStaffRoleRefData() {
    this.refDataSubscription = this.lookupSvc.fetchLookup<StaffRolePermission>('FetchStaffRolePermission')
      .subscribe(result => {
        this.typeItems = [];
        result.forEach(staffRole => {
          let newRolePerm = this.initStaffRolePerm
      (staffRole);
          this.typeItems.push(newRolePerm);
        });

        this.selectedItem = this.typeItems[0];
        this.copySelectedItem();

        // If items in list, default to first item
        setTimeout(() => {
          if (this.itemsList.options.first)
            this.itemsList.options.first.selected = true;
        }, 100);

      })
  }

  permBox(event: MatCheckboxChange) {
    this.selectedItem.permissionsState[event.source.value].checked = event.checked;
  }

  createNewItem() {
    this.itemsList.deselectAll();
    this.selectedItem = new StaffRolePermission();
    this.copySelectedItem();
  }

  private initStaffRolePerm(inSRP: StaffRolePermission): StaffRolePermission {
    let staffRolePermission = new StaffRolePermission();
    staffRolePermission = inSRP;
    staffRolePermission.permissionsState = JSON.parse(JSON.stringify(this.checkablePerms));//Object.assign([],this.checkablePerms);
    staffRolePermission.permissions.forEach(rolePerm => {
      staffRolePermission.permissionsState.forEach(permState => {
        if (rolePerm.permissionOID === permState.permission.permissionOID) {
          permState.checked = true;
        }
      });
    });
    return staffRolePermission;
  }

  saveDataItem() {
    this.adminSvc.saveRolePermission(this.selectedItem).subscribe(response => {
      if (response instanceof Array) {
        response.forEach(elemStaffRolePermissions => {
          let index: number = this.getIndexOfItem(elemStaffRolePermissions);
          if (index >= 0) {
            this.typeItems[index] = this.initStaffRolePerm
        (elemStaffRolePermissions);
            console.log("elemStaffRolePermissions updated!");
          }
        });
        this.toastSvc.showSuccessMessage('Item Saved');
      } else {
        console.log("single entry, expected array");
        this.toastSvc.showErrorMessage('There was an error saving the item.');
      }
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
    this.selectedItemBak = Object.assign(new StaffRolePermission(), this.selectedItem);
    this.selectedItemIdx = this.getIndexOfItem(this.selectedItem);
  }

  cancelDataItemEdit(event) {
    this.selectedItem = Object.assign(new StaffRolePermission(), this.selectedItemBak);
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

