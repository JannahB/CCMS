import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpBaseService } from '../http/http-base.service';


@Injectable()
export class GenericTypesService extends HttpBaseService<any> {

  private mockFile: string = 'generic.types.json';

  // Override Base URL's set in Super
  protected getBaseUrl():string{
    return `${super.getBaseUrl()}/FetchGenericTypes`;
  }

  protected getBaseMockUrl():string{
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

}
