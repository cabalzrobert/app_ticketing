import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth.service';
import { GeneralService } from '../../shared/services/general.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, filter } from 'rxjs';
import { rest } from '../../+services/services';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.scss'
})
export class ReportPageComponent implements OnInit {
  
  reportlist:any = [];
  reportlist1: any = [];
  constructor(private authService: AuthService, public dialog: MatDialog, public generalSerive: GeneralService) {

    this.Search = new FormControl();
  }
  Search: any = {};
  loader:boolean = true;
  ngOnInit(): void {
    this.GetUserAccountList({ num_row: 0, Search: this.Search.value });
  }
  hSearchUsers() {
    this.GetUserAccountList({ num_row: 0, Search: this.Search.value });
  }

  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);



  GetUserAccountList(item: any): Observable<any> {

    rest.post('report/ticketrequestperdepartment').subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.reportlist = res.report;
        //console.log('GetPositionList inside subscribe', this.usersList);
        this.loader = false;
        console.log('Report', this.reportlist);
        return this.reportlist;
        //this.categorylist;
      }
    });
    //console.log('GetPositionList outside subscribe', this.usersList);
    return this.reportlist;
  }

}
