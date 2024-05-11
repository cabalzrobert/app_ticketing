import { Component, OnInit, input } from '@angular/core';
import { jUser, jUserModify } from '../../+app/user-module';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss'
})
export class OverviewPageComponent implements OnInit {
  subs: any;
  input:any = {};
  ngOnInit(): void {
    console.log('ngOnInit this', this);
    // this.subs.u = jUserModify(async () => {
    //   const u: any = await jUser();
    //   console.log('ngOnInt const u 80', u);
    //   Object.assign(this.input, u);
    //   console.log('ngOnInt this.input 1', this.input);
    // });
    // console.log('ngOnInt this.subs 1', this.subs);
  }


}
