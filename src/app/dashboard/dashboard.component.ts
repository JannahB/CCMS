import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import { ToastService } from '../common/services/utility/toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  selectedCourt: any;
  suggestionTypes: SelectItem[] = [{label:'Ask a Question', value: 1}, {label:'Make a Comment', value: 2},{label:'Suggest a Feature', value: 3}, {label:'Report an Issue', value: 4}]

  constructor( private breadCrumbSvc:BreadcrumbService, private toastSvc:ToastService) {
    this.breadCrumbSvc.setItems([]);
  }

  ngOnInit() {
  }

  makeToast() {
    this.toastSvc.showInfoMessage('Thank you for submitting your suggestion. ', 'Submitted');
  }
}
