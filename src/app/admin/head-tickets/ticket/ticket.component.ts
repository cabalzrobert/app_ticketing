import { Component, Input, ViewChild } from '@angular/core';
import { rest } from '../../../+services/services';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {
  @Input() detail: any;
  @ViewChild('Scroll') Scroll!: CdkVirtualScrollViewport;
  _message: any;
  messageHandler: any = [];
  userId = '00020010000001';

  ngOnInit(){
    setTimeout(()=>this.performGetTicketComments());
    // this.onScrollChange();
  }

  onScrollChange(){
    console.log(this.Scroll.getDataLength().valueOf());
  }

  sendMessage(){
    if(!this._message) return;
    // this.messageHandler = [...this.messageHandler,{value: this.message, isLeft: 1}];
    // this.messageHandler.push({value: val, isLeft: 1});
    this._message = null;
    console.log(this.messageHandler);
  }

  performGetTicketComments = async () => {
    rest.post(`head/ticket/comments?transactionNo=${this.detail.transactionNo}`,{}).subscribe((res: any) => {
      if (res) {
        // this.messageHandler = [...this.messageHandler,res];
        this.messageHandler = res;
        console.log(this.messageHandler);
        return
      }
      alert('Failed');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  cancel = async () => {
    rest.post(`head/ticket/cancel?ticketNo=${this.detail.ticketNo}`,{}).subscribe((res: any) => {
      if (res.Status === 'ok') {
        this.detail.status = 3;
        return;
      }
      alert('Failed');
    }, (err: any) => {
      alert('System Error!');
    });
  }

  
}
