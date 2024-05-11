import { Component, Output, EventEmitter, OnInit, HostListener, input, inject } from '@angular/core';
import { navbarData } from './nav-data';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../auth.service';
import { stomp } from '../+services/stomp.service';
import { rest } from '../+services/services';
import { timeout } from '../tools/plugins/delay';
import { jUser, jUserModify } from '../+app/user-module';
import { device } from '../tools/plugins/device';
import { LocalStorageService } from '../tools/plugins/localstorage';

//const { Object }: any = window;
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350s',
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350s',
          style({ opacity: 0 })
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {
  logout() {
    this.authService.logout();
  }
  constructor(public router: Router, private authService: AuthService, private ls:LocalStorageService) {
    
  }
  @HostListener('window:resize', ['$event'])
  onWindowInitialize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
    else {
      this.collapsed = true;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
    else {
      this.collapsed = true;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }
  subs: any = {};
  prop: any = {};
  input: any = {};
  async ngOnInit(): Promise<void> {
    //Object = {window};
    this.screenWidth = window.innerWidth;
    this.collapsed = true;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    device.ready();
    console.log('Device is Browser ', device.isAndroid);

    let auth:any = this.ls.getItem1('Auth');
    if(auth != ''){
      rest.setBearer(JSON.parse(auth).Token);
    }
    
    this.onWindowInitialize();
    this.stompReceivers();

  }
  loadHome() {
    this.router.navigateByUrl('/dashboard');
  }
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  private stompReceivers() {
    this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
    console.log('stompReceiver this.subs', this.subs);
  }
  private error() {
    this.ping(() => this.testPing());
  }
  private testPing() {
    const { subs } = this;
    this.stopPing();
    this.ping(() => subs.tmPing = timeout(() => this.testPing(), (60000 * 1)));
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
