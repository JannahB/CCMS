import { ErrorHandler, Injectable, Injector } from '@angular/core';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error:Error) {
      let message:string = error.message ? error.message : error.toString();

      //TODO: Do something with the errors

      throw error;
  }

}
