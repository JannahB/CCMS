import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatSelectionList, MatSelectionListChange, MatOption, MatListOption, SELECT_PANEL_INDENT_PADDING_X } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { LookupService } from './../../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AdminDataService } from '../../../common/services/http/admin-data.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { environment } from './../../../../environments/environment';
import { Court } from './../../../common/entities/Court';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styles: [
    `
    h2 {
      font-weight: 300;
      text-transform: uppercase;
    }

    `
  ]
})
export class CourtComponent implements OnInit, AfterViewInit {


  typeItems: Court[];
  selectedItem: Court;

  allowDeleteLookupItems: boolean;
  selectedItemIdx: number;
  selectedItemBak: Court;
  showDeleteItemModal: boolean = false;

  tableLabel: string = "Court"
  refDataSubscription: Subscription;

  constructor(
    private breadCrumbSvc: BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Data Table Maintenance', routerLink: ['/admin/data'] },
      { label: 'Court', routerLink: ['/admin/data/courts'] }
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
    this.refDataSubscription = this.lookupSvc.fetchLookup<Court>('FetchCourt')
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
    this.selectedItem = new Court();
    this.copySelectedItem();
  }

  saveDataItem() {
    this.adminSvc.saveCourt(this.selectedItem).subscribe(response => {
      if (response instanceof Array) {
        response.forEach(elemCourt => {
          let index: number = this.getIndexOfItem(elemCourt);

          if (index >= 0) {
            this.typeItems[index] = elemCourt;
            console.log("elemCourt updated!");
          } else {            
            this.selectedItem=elemCourt;
            this.copySelectedItem();
            this.typeItems.push(this.selectedItem);
            console.log("elemCourt added!");
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
    this.selectedItemBak = Object.assign(new Court(), this.selectedItem);
    this.selectedItemIdx = this.getIndexOfItem(this.selectedItem);
  }

  cancelDataItemEdit(event) {
    this.selectedItem = Object.assign(new Court(), this.selectedItemBak);
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
    this.adminSvc.deleteLookupItem('Court', this.selectedItem.courtOID).subscribe(result => {
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
      .findIndex(itm => itm.courtOID == item.courtOID);
  }

}

