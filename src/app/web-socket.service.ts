import { Injectable, input } from '@angular/core';
//import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { rest } from './+services/services';
import * as Rx from 'rxjs';
import { stomp } from './+services/stomp.service';
import { jUser } from './+app/user-module';
import { timeout } from './tools/plugins/delay';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  /*
  public socket$!: WebSocketSubject<any>;
  private todoArr: string[] = [];
  constructor() {
  }
  connect() {
    //this.socket$ = webSocket('ws://localhost:8080'); // Replace with your WebSocket server URL 
    this.socket$ = webSocket(rest.ws('ws', true));
    console.log('connect websocket 17');
  }
  disconnect() {
    this.socket$.complete();
  }
  isConnected(): boolean {
    return (this.socket$ === null ? false : !this.socket$.closed);
  }
  onMessage(): Observable<any> {
    return this.socket$!.asObservable().pipe(
      map(message => message)
    );
  }
  receivedStatus(){
    return this.we
  }
  send(message: any) {
    this.socket$.next(message);
  }
  getTodoArr(): string[] {
    return this.todoArr;
  }
  */

  /*
  constructor() { }
  private subject!: Rx.Subject<MessageEvent>;
  public connect(url: string): Rx.Subject<MessageEvent> {
    if (this.subject) {
      this.subject = this.create(url);
      return this.subject
    }
    return this.subject;
  }
  private create(url:any): Rx.Subject<MessageEvent>{
    let ws = new WebSocket(url);
    let observable = Rx.Observable.create((obs:Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      next:(data:Object) => {
        if(ws.readyState === WebSocket.OPEN){
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }
  */
 public token(){
  console.log('web-socket.service.ts token');
 }
 input:any = {};
 subs:any = {};
  prop:any = {};
 

 public async stompWebsocketReceiver() {
  //console.log('web-socket.service.ts stompWebsocketReceiver');
  // this.input = await jUser();
  // var iscom = (this.input.isCommunicator == true) ? 1 : 0;
  // this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
  // this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
  // this.subs.wsDisconnect = stomp.subscribe('#disconnect', () => this.disconnect());
  // this.subs.ws1 = stomp.subscribe('/' + iscom + '/ticketrequest/iscommunicator', (json: any) => this.receivedRequestTicketCommunicator(json));
   stomp.ready(() => (stomp.refresh(), stomp.connect()));
  //console.log('stompWebsocketReceiver 250 sidenav.components', this.subs);
}
receivedRequestTicketCommunicator(data: any) {

  var content = data.content;
  if(this.input.LastTransactionNo == content.TransactionNo) return;
  
  this.refreshData();
  return this.input.NotificationCount;
}
private async refreshData() {
  //jUserModify();
  this.input = await jUser();
}
private error() {
  this.ping(() => this.testPing());
}
private ReceivedTest(data: any) {
  //console.log('Received Test', data);
}
private disconnect() {
  this.stopPing();
}
private testPing() {
  const { subs } = this;
  this.stopPing();
  this.ping(() => subs.tmPing = timeout(() => this.testPing(), (60000 * 1)));
}

logNotify() {
  rest.post('ticket/test/notify').subscribe(async (res: any) => {
    //console.log('logNotify res', res);
    //additionalNotification(1);
  });
}

private ping(callback: Function) {
  const { prop, subs } = this;
  this.stopPing();
  this.subs.ping = rest.post('ping', {}).subscribe(async (res: any) => {
    if (res.Status == 'error') {
      if (res.Type == 'device.session-end') {
        if (!!prop.IsSessionEnd) return;
      }
    }
    if (!stomp.IsConnected)
      return;
    return callback();
  }, (err: any) => {
    if (!stomp.IsConnected)
      return;
    return callback();
  });
}
private connected() {
  this.ping(() => this.testPing());
}
private stopPing() {
  const { subs } = this;
  const { tmPing, ping } = subs;
  if (tmPing) tmPing.unsubscribe();
  if (ping) ping.unsubscribe();
}
 
  private subject!: WebSocketSubject<any>;
  constructor() { }
  public connect() {
    this.subject = webSocket({
      url: rest.ws('ws', true),
      openObserver: {
        next: () => {
          //console.log('connexion ok');
        }
      },
      closeObserver: {
        next: () => {
          //console.log('disconnect ok');
        }
      }
    });
    
    
    this.subject.subscribe(
      msg => console.log('message received: ' + msg),
      err => console.log(err),
      () => console.log('complete')
    );
    this.subject.subscribe((message:any) => console.log('message', message))
    //console.log('connect this.subject',  this.subject);
  }
  public send(msg: string) {
    this.subject.next(msg);
  }

  public disconnect1() {
    this.subject.complete();
  }
}