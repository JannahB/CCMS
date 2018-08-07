import { SelectItem } from 'primeng/primeng';
import { CourtCount } from './../../common/entities/CourtCount';
import { CaseCountsService } from './../../common/services/http/case-counts.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Message } from 'primeng/components/common/api';


@Component({
  selector: 'app-case-counts',
  templateUrl: './case-counts.component.html',
  styleUrls: ['./case-counts.component.scss']
})
export class CaseCountsComponent implements OnInit {

  selectedCourt: any;
  showRecordsFoundMessage: boolean = false;
  recordsFoundMessage: string;
  courtCounts: CourtCount[];
  filterYears: SelectItem[];
  selectedYear: number = new Date().getFullYear();

  constructor(
    private caseCountSvc: CaseCountsService,
    private router: Router
  ) { }

  ngOnInit() {

    let filterYears: SelectItem[] = [];
    let currentYear = new Date().getFullYear() - 5;
    for (let index: number = 5; index > 0; index--) {
      let year = currentYear;
      year = year + index;
      filterYears.push({
        label: year.toString(),
        value: year
      });
    }

    this.filterYears = filterYears;
    this.getCounts();
  }

  getCounts(): void {
    this.showRecordsFoundMessage = false;
    this.caseCountSvc.getCaseCountsByYear(this.selectedYear)
      .subscribe((result) => {
        this.courtCounts = result;
        this.showNumberOfRecordsFound(result.length);
        if (result) this.selectedCourt = this.courtCounts[0];
      });
  }

  onYearChange(event): void {
    console.log(event);
    this.selectedYear = event.value;
    this.getCounts();
  }

  showNumberOfRecordsFound(num) {
    let text = num == 1 ? ' record found' : ' records found';
    this.showRecordsFoundMessage = true;
    this.recordsFoundMessage = num + text;
  }

  onRowSelect(event) {
    console.log(event);
    this.selectedCourt = event.data;
    // this.router.navigate(['party-detail', partyId]);
  }



}
