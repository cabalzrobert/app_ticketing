import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../tools/plugins/localstorage';
import { WebSocketService } from '../web-socket.service';
import { rest } from '../+services/services';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  constructor(public ls: LocalStorageService, public websocketservice: WebSocketService) { }
  async ngOnInit(): Promise<void> {
    let token = await this.ls.getItem1('Auth');
    //console.log('admin components', token);
    //this.websocketservice.stompWebsocketReceiver();
    // if (await this.ls.getItem1('isReload') == null) {
    //   console.log('isReload is not defined');
    //   this.ls.setItem('isReload', '1');
    //   //window.location.reload();
    // }

  }
  isSideNavCollapsed = false;
  screenWidth = 0;
  onToggleSidvNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
    //console.log('onToggleSideNav data', data);
  }

}
