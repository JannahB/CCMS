import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpBaseService } from '../http/http-base.service';
import { Identifier } from '../../entities/Identifier';


@Injectable()
export class IdentifierService extends HttpBaseService<Identifier> {

  private mockFile: string = 'identifier-types-temp.json';

  // Override Base URL's set in Super
  protected getBaseUrl():string{
    return `${super.getBaseUrl()}/FetchIdentifiers`;
  }

  protected getBaseMockUrl():string{
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }
  

}
