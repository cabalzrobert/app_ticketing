import { Component, OnInit, input } from '@angular/core';
import { jUser, jUserModify } from '../../+app/user-module';
import { device } from '../../tools/plugins/device';
import { stomp } from '../../+services/stomp.service';
import { Capacitor } from '@capacitor/core';
import { rest } from '../../+services/services';
import { timeout } from '../../tools/plugins/delay';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss'
})
export class OverviewPageComponent implements OnInit {
  subs: any;
  input:any = {};
  prop:any = {};
  ngOnInit(): void {
    //console.log('Overview', Capacitor.platform);
    //console.log('ngOnInit this', this);
    device.ready();
    // this.subs.u = jUserModify(async () => {
    //   const u: any = await jUser();
    //   console.log('ngOnInt const u 80', u);
    //   Object.assign(this.input, u);
    //   console.log('ngOnInt this.input 1', this.input);

    // });
    //console.log('ngOnInt this.subs 1', this.subs);
    device.ready(() => this.stompWebsocketReceiver());
    //window.location.reload();
  }

  private async stompWebsocketReceiver() {
    this.input = await jUser();
    var iscom = (this.input.isCommunicator == true) ? 1 : 0;
    //console.log('stompWebsocketReceiver');
    this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
    this.subs.wsDisconnect = stomp.subscribe('#disconnect', () => this.disconnect());
    stomp.ready(() => (stomp.refresh(), stomp.connect()));
  }
  receivedRequestTicketCommunicator(data: any) {
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
  


}
