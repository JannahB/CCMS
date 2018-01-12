import { Injectable } from '@angular/core';

// import { Message } from 'primeng/primeng';
import {Message} from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';


@Injectable()
export class ToastService {

  msgs: Message[];

  constructor( private msgsvc:MessageService ) { }

  showSuccessMessage(message, title='Success') {
    this.msgsvc.add({severity:'success', summary:title, detail: message});
  }

  showInfoMessage(message, title='Info') {
    this.msgsvc.add({severity:'info', summary:title, detail: message});
  }

  showWarnMessage(message, title='Warning') {
    this.msgsvc.add({severity:'warn', summary:title, detail: message});
  }

  showErrorMessage(message, title='Error') {
    this.msgsvc.add({severity:'error', summary:title, detail: message});
  }

  clearMessages() {
    this.msgsvc.clear();
  }

}
