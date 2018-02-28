import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import "rxjs/add/observable/forkJoin";

import { CaseType } from './../../../common/entities/CaseType';
import { LookupService } from './../../../common/services/http/lookup.service';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { AdminDataService } from '../../../common/services/http/admin-data.service';
import { ToastService } from '../../../common/services/utility/toast.service';
import { environment } from './../../../../environments/environment';
import { IccsCode } from './../../../common/entities/IccsCode';


@Component({
  selector: 'app-iccs-codes',
  templateUrl: './iccs-codes.component.html',
  styles: [
    `
    h2 {
      font-weight: 300;
      text-transform: uppercase;
    }
    `
  ]
})
export class IccsCodesComponent implements OnInit {


  activeList: IccsCode[];
  selectedItem: IccsCode;
  selectedItems: IccsCode[]; // used only to satisfy selection-list need for plurality
  parentList: IccsCode[];
  selectedParentItem: IccsCode;
  categories: any[];
  selectedCatIdx: number;
  tabLabel: string;
  miniBreadcrumb: string;

  parentList0: IccsCode[];
  parentList1: IccsCode[];
  parentList2: IccsCode[];
  parentList3: IccsCode[];

  selectedItemIdx: number;
  selectedItemBak: IccsCode;
  allowDeleteLookupItems: boolean;
  showDeleteItemModal: boolean = false;
  editing: boolean = false;

  tableLabel:string = "ICCS Code"
  refDataSubscription: Subscription;
  parentRefDataSubscription: Subscription;

  constructor(
    private breadCrumbSvc:BreadcrumbService,
    private lookupSvc: LookupService,
    private adminSvc: AdminDataService,
    private toastSvc: ToastService
  ) {
    this.breadCrumbSvc.setItems([
      { label: 'Data Table Maintenance', routerLink: ['/admin/data'] },
      { label: 'ICCS Codes', routerLink: ['/admin/data/iccscodes'] }
    ]);
   }

  @ViewChild(MatSelectionList) itemsList: MatSelectionList;

  ngOnInit(){
    this.allowDeleteLookupItems = environment.allowDeleteLookupItems;
  }

  ngAfterViewInit() {

    this.getParentRefData();

    // Handle selection change via dom element so we can DeselectAll
    this.itemsList.selectionChange.subscribe((event: MatSelectionListChange) => {
      this.itemsList.deselectAll();
      event.option.selected = true;
      this.selectedItem = event.option.value;
      this.copySelectedItem();
      console.log('event.option.value', event.option.value);
    });

  }

  ngOnDestroy() {
    if(this.refDataSubscription) this.refDataSubscription.unsubscribe();
    if(this.parentRefDataSubscription) this.parentRefDataSubscription.unsubscribe();
  }


  getParentRefData() {

    this.categories = [
      {id: 1, name: 'Section'},
      {id: 2, name: 'Division'},
      {id: 3, name: 'Group'},
      {id: 4, name: 'Class'}
    ];

    var source = Observable.forkJoin<any>(
      this.adminSvc.fetchICCSCodeParent<IccsCode>(1),
      this.adminSvc.fetchICCSCodeParent<IccsCode>(2),
      this.adminSvc.fetchICCSCodeParent<IccsCode>(3),
      this.adminSvc.fetchICCSCodeParent<IccsCode>(4),
    );

    this.parentRefDataSubscription = source.subscribe(
      results => {
        this.parentList0 = results[0] as IccsCode[];
        this.parentList1 = results[1] as IccsCode[];
        this.parentList2 = results[2] as IccsCode[];
        this.parentList3 = results[3] as IccsCode[];
    });

    this.parentRefDataSubscription = this.adminSvc.fetchICCSCodeParent<IccsCode>(1)
      .subscribe(result => {
        this.parentList = result;
        this.selectedParentItem = this.parentList[0];
        this.getRefDataItems();
      })

    this.selectedCatIdx = 0;
    this.selectedTabIndexChange(this.selectedCatIdx);
  }

  selectedTabIndexChange(event) {
    console.log(event);
    this.parentList = this['parentList'+ event];
    this.setSelectedParent(event);
  }

  selectedParentChange(event) {
    console.log('parentchange', event);
    this.setSelectedParent(event.value);
  }

  setSelectedParent(idx = 0){
    this.selectedParentItem = this.parentList[idx];
    this.setList(idx);
  }

  setList(idx = 0){
    this.activeList = this['list'+idx];
    this.setSelectedItem(0);
  }

  setSelectedItem(idx = 0){
    this.selectedItem = this.activeList[idx];
    this.selectedItems = [];
    this.selectedItems.push(this.selectedItem);
    console.log('selectedItem', this.selectedItem)
    this.genBreadCrumb();
  }

  genBreadCrumb(){
    let part1 = this.categories[this.selectedCatIdx].name;
    let part2 = this.selectedParentItem ? '  |  ' + this.selectedParentItem.categoryName : '';
    let part3 = this.selectedItem ? '  |  ' + this.selectedItem.categoryName : ''
    this.miniBreadcrumb = part1 + part2 + part3;
  }




  getRefDataItems() {
    let id = this.selectedParentItem.iccsCodeOID;
    this.refDataSubscription = this.adminSvc.fetchICCSCodeParent<IccsCode>(this.selectedParentItem.iccsCodeOID)
      .subscribe(result => {
        this.activeList = result;
        this.selectedItem = this.activeList[0];
        this.copySelectedItem();
        // If items in list, default to first item
        setTimeout(() => {
          if( this.itemsList.options.first )
            this.itemsList.options.first.selected = true;
        }, 100);


    })
  }

  parentItemOnChange(event) {
    let parentTypeId = event.value;
    this.selectedParentItem = this.parentList.find( itm => itm.iccsCodeOID == parentTypeId);
    this.getRefDataItems();
  }

  createNewItem() {
    this.editing = true;
    this.itemsList.deselectAll();
    this.selectedItem = new IccsCode();
    this.selectedItem.iccsCodeOID = this.selectedParentItem.iccsCodeOID;
    this.copySelectedItem();
  }

  saveDataItem(){
    this.adminSvc.saveICCSCode(this.selectedItem).subscribe( result => {
      console.log('result', result);
      let savedItem:IccsCode = result[0]

      let index:number = this.getIndexOfItem(savedItem);

      if(index >= 0){
        this.activeList[index] = savedItem;
      }else{
        this.activeList.push(savedItem);
      }
      this.activeList = this.activeList.slice();
      this.toastSvc.showSuccessMessage('Item Saved');
    },
    (error) => {
      console.log(error);
      this.toastSvc.showErrorMessage('There was an error saving the item.');
    },
    () => {
      this.editing = false;
    })
  }

  copySelectedItem() {
    this.selectedItemBak = Object.assign( new IccsCode(), this.selectedItem );
    this.selectedItemIdx = this.getIndexOfItem(this.selectedItem);
  }

  cancelDataItemEdit(event) {
    this.editing = false;
    this.selectedItem = Object.assign( new IccsCode(), this.selectedItemBak );
    this.activeList[this.selectedItemIdx] = this.selectedItem;
  }

  deleteDataItemRequest() {
    if(!this.allowDeleteLookupItems) {
      this.toastSvc.showInfoMessage('Delete support is currently not available.');
      return;
    }
    this.showDeleteItemModal = true;
  }

  deleteDataItem() {
    this.adminSvc.deleteLookupItem('IccsCode', this.selectedItem.iccsCodeOID).subscribe( result => {
      this.activeList.splice(this.getIndexOfItem(), 1);
      this.selectedItem = this.activeList[0];
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
    return this.activeList
        .findIndex(itm => itm.iccsCodeOID == item.iccsCodeOID);
  }

}

