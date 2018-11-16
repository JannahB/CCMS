import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { LookupService } from '../../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AdminDataService } from '../../../common/services/http/admin-data.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { environment } from '../../../../environments/environment';
import { EventType } from '../../../common/entities/EventType';


@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styles: [
    `
    h2 {
      font-weight: 300;
      text-transform: uppercase;
    }

    `
  ]
})
export class EventTypesComponent implements OnInit {

  typeItems: EventType[];
  selectedItem: EventType;

  allowDeleteLookupItems: boolean;
  selectedItemIdx: number;
  selectedItemBak: EventType;
  showDeleteItemModal: boolean = false;

  eventCategories: any[];
  tableLabel: string = "Event Type"
  refDataSubscription: Subscription;


  constructor(
    private breadCrumbSvc: BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Data Table Maintenance', routerLink: ['/admin/data'] },
      { label: 'Event Types', routerLink: ['/admin/data/eventtypes'] }
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
    this.refDataSubscription = this.adminSvc.fetchLookup<EventType>('FetchEventType')
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

    this.eventCategories = [{ id: 1, name: "Case" }, { id: 2, name: "Log" }]
  }

  eventCatOnChange(event) {
    this.selectedItem.eventCategoryText = event.value;
  }

  createNewItem() {
    this.itemsList.deselectAll();
    this.selectedItem = new EventType();
    this.copySelectedItem();
  }

  saveDataItem() {
    this.adminSvc.saveEventType(this.selectedItem).subscribe(result => {
      console.log('result', result);

      let index: number = this.getIndexOfItem(result);

      if (index >= 0) {
        this.typeItems[index] = result;
      } else {
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
    this.selectedItemBak = Object.assign(new EventType(), this.selectedItem);
    this.selectedItemIdx = this.getIndexOfItem(this.selectedItem);
  }

  cancelDataItemEdit(event) {
    this.selectedItem = Object.assign(new EventType(), this.selectedItemBak);
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
    this.adminSvc.deleteLookupItem('CaseType', this.selectedItem.eventTypeOID).subscribe(result => {
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
      .findIndex(itm => itm.eventTypeOID == item.eventTypeOID);
  }

}
