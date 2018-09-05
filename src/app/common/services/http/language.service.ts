import { Language } from './../../entities/Language';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpBaseService } from '../http/http-base.service';


@Injectable()
export class LanguageService extends HttpBaseService<Language> {

  private mockFile: string = 'languages.json';

  // Override Base URL's set in Super
  protected getBaseUrl():string{
    return `${super.getBaseUrl()}/api/language-types`;
  }

  protected getBaseMockUrl():string{
    return `${super.getBaseMockUrl()}/${this.mockFile}`;
  }

}
