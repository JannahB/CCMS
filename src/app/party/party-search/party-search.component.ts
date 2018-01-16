import { Component, OnInit } from '@angular/core';
import { PartyService } from '../../common/services/http/party.service';

@Component({
  selector: 'app-party-search',
  templateUrl: './party-search.component.html',
  styleUrls: ['./party-search.component.scss']
})
export class PartySearchComponent implements OnInit {

  public partyNameText:string = "";

  constructor(
    private partyService:PartyService
  ) { }

  ngOnInit() {
  }

  public onSearch():void{
    this.partyService
      .fetch(this.partyNameText)
      .subscribe();
  }

}
