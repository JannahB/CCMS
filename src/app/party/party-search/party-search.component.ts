import { Component, OnInit } from '@angular/core';
import { PartyService } from '../../common/services/http/party.service';
import { Party } from '../../common/entities/Party';
import { Router } from '@angular/router';

@Component({
  selector: 'app-party-search',
  templateUrl: './party-search.component.html',
  styleUrls: ['./party-search.component.scss']
})
export class PartySearchComponent implements OnInit {

  partyNameText:string = "";
  partyResults: Party[]

  constructor(
    private partyService:PartyService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  public onSearch():void{
    let obj = { "partyName": this.partyNameText };
    this.partyService
      .fetchAny(obj)
      .subscribe((result) => {
        this.partyResults = result;
      });
  }

  partyOnRowSelect(event) {
    console.log(event)
    let partyId = event.data.partyOID;

    this.router.navigate(['party-detail', partyId ]);

  }

}
