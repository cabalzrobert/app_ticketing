import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { device } from '../tools/plugins/device';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent implements OnInit {
  constructor(private authService: AuthService, private router:Router, private zone: NgZone){}
  ngOnInit(): void {
    console.log('Public Components');
    device.ready(() => this.sessionNotEmpty());
  }
  sessionNotEmpty() {
    if (this.authService.session) {
      console.log('SessionNotEmpty', this.authService.session, this.router);
      this.zone.run(() => this.router.navigateByUrl('/'));
    }
  }

}
