import { Component, OnInit } from '@angular/core';
import { AssignmentManagerService } from '../../common/services/http/assignment-manager.service';
import { AllocationPeriod } from '../../common/entities/AllocationPeriod';
import { JudicialPool } from '../../common/entities/JudicialPool';

@Component({
  selector: 'app-assignment-manager',
  templateUrl: './assignment-manager.component.html',
  styleUrls: ['./assignment-manager.component.scss']
})
export class AssignmentManagerComponent implements OnInit {

  judicialPool: JudicialPool[];
  allocationPeriods: AllocationPeriod[];
  selectedAllocationPeriod: any;
  allocationPeriod: AllocationPeriod;
  beginAllocationPeriod = new Date();

  constructor(private assignmentManagerSvc: AssignmentManagerService) { }

  ngOnInit() {

    this.assignmentManagerSvc.get().subscribe(result => {
      console.log('allocation periods', result);
      this.allocationPeriods = result;
    });

    this.assignmentManagerSvc.getWeightAllocationByAllocationPeriodId(1).subscribe(result => {
      console.log('judicial pool', result);
      this.judicialPool = result;
    });

  }

  onTemplateSelectionChange(event, template) {
    // deselect all others & set selected
    if (event.selected) {
      event.source.selectionList.options.toArray().forEach(element => {
        if (element.value.beginAllocationPeriod != template.beginAllocationPeriod) {
          element.selected = false;
        } else {
          this.selectedAllocationPeriod = element.value;
          this.assignmentManagerSvc.getWeightAllocationByAllocationPeriodId(element.value.id).subscribe(result => {
            console.log('judicial pool', result);
            this.judicialPool = result;
          });
          this.assignmentManagerSvc.getById(element.value.id).subscribe(result => {
            console.log('allocation period element.value.id', result);
            this.allocationPeriod = result;
            this.beginAllocationPeriod = result.beginAllocationPeriod;
          });
        }
      });
    }
  }

}
