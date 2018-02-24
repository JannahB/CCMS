import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { LookupService } from './../../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AdminDataService } from '../../../common/services/http/admin-data.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { environment } from './../../../../environments/environment';
import { CasePartyRole } from './../../../common/entities/CasePartyRole';

@Component({
  selector: 'app-case-party-roles',
  templateUrl: './case-party-roles.component.html',
  styles: [
    `
    h2 {
      font-weight: 300;
      text-transform: uppercase;
    }

    `
  ]
})
export class CasePartyRolesComponent implements OnInit {


  typeItems: CasePartyRole[];
  selectedItem: CasePartyRole;

  allowDeleteLookupItems: boolean;
  selectedItemIdx: number;
  selectedItemBak: CasePartyRole;
  showDeleteItemModal: boolean = false;

  tableLabel:string = "Case Party Role"
  refDataSubscription: Subscription;

  constructor(
    private breadCrumbSvc:BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Data Table Maintenance', routerLink: ['/admin/data'] },
      { label: 'Case Party Role', routerLink: ['/admin/data/casepartyroles'] }
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
    this.refDataSubscription = this.lookupSvc.fetchLookup<CasePartyRole>('FetchCasePartyRole')
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

  onSelectionChange(event) {
    // Handling selection change with MatSelectionListChange observable above
    // this.selectedItem = event.option.value[0];
  }

  createNewItem() {
    this.itemsList.deselectAll();
    this.selectedItem = new CasePartyRole();
    this.copySelectedItem();
  }

  saveDataItem(){
    this.adminSvc.saveCasePartyRole(this.selectedItem).subscribe( result => {
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
    this.selectedItemBak = Object.assign( new CasePartyRole(), this.selectedItem );
    this.selectedItemIdx = this.getIndexOfItem(this.selectedItem);
  }

  cancelDataItemEdit(event) {
    this.selectedItem = Object.assign( new CasePartyRole(), this.selectedItemBak );
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
    this.adminSvc.deleteLookupItem('CasePartyRole', this.selectedItem.casePartyRoleOID).subscribe( result => {
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
        .findIndex(itm => itm.casePartyRoleOID == item.casePartyRoleOID);
  }

}

