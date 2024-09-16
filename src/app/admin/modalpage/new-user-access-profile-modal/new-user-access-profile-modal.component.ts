import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth.service';
import { FormBuilder } from '@angular/forms';
import { SubmitModalComponent } from '../submit-modal/submit-modal.component';
import { AlertSuccessModalComponent } from '../alert-success-modal/alert-success-modal.component';
import { filter } from 'rxjs';
import { rest } from '../../../+services/services';
import { AlertSuccessModalDepartmentComponent } from '../alert-success-modal-department/alert-success-modal-department.component';

@Component({
  selector: 'app-new-user-access-profile-modal',
  templateUrl: './new-user-access-profile-modal.component.html',
  styleUrl: './new-user-access-profile-modal.component.scss'
})
export class NewUserAccessProfileModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public UserAccess: { item: any, Title: String, SaveButton: String }, private authService: AuthService, private fb: FormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<NewUserAccessProfileModalComponent>) { }
  ngOnInit(): void {
    this._userid = this.UserAccess.item.USR_ID;
    this._useraccount = this.UserAccess.item.UserAccount;
    this._department = this.UserAccess.item.DepartmentName;
    this._menutab = this.UserAccess.item.MenuTab;
    this._type = this.UserAccess.item.AccountTypeName;
    // console.log('Item this.UserAccess.item.MenuTab', this.UserAccess.item.MenuTab);
    // console.log('Item this.UserAccess.item.UserAccount', this.UserAccess.item.UserAccount);
    console.log('Item this.UserAccess.item', this.UserAccess.item);
    //this.checLoadedDataMenu('[{"routerLink":"overview","icon":"fa fa-th-large","label":"Overview","isSelect":true},{"routerLink":"ticket","icon":"fa fa-light fa-ticket-alt","label":"Submitted Tickets","isSelect":true},{"routerLink":"myTask","icon":"fa fa-light fa-ticket-alt","label":"My Tasks","isSelect":true},{"routerLink":"report","icon":"fa fa-light fa-ticket-alt","label":"Report","isSelect":true}]');
    this.checLoadedDataMenu(this.UserAccess.item.MenuTab);

  }
  datamenu: any = [
    {
      routerLink: 'overview',
      icon: 'fa fa-th-large',
      label: 'Overview',
      isSelect: false,
      routerLinkActive:true
    },
    {
      routerLink: 'ticket',
      icon: 'fa fa-light fa-ticket-alt',
      label: 'Submitted Tickets',
      isSelect: false,
      routerLinkActive:false
    },
    {
      routerLink: 'assignedticket',
      icon: 'fa fa-light fa-ticket-alt',
      label: "Assigned Tickets",
      isSelect: false,
      routerLinkActive:false
    },
    {
      routerLink: 'myTask',
      icon: 'fa fa-light fa-ticket-alt',
      label: "My Tasks",
      isSelect: false,
      routerLinkActive:false
    },
    {
      routerLink: 'receivedtickets',
      icon: 'fa fa-light fa-ticket-alt',
      label: 'Tickets',
      isSelect: false,
      routerLinkActive:false
    },
    {
      routerLink: 'report',
      icon: 'fa fa-light fa-ticket-alt',
      label: 'Report',
      isSelect: false,
      routerLinkActive:false
    },
    {
      routerLink: '',
      icon: '',
      label: '',
      isSelect: false,
      routerLinkActive:false
    },
    // {
    //   routerLink: 'useraccess',
    //   icon: 'fa fa-unlock',
    //   label: 'User Access',
    //   isSelect: false
    // }

  ];
  loaddatamenu: any = [];
  _isselected: boolean = false;
  checklist: any;
  checkedList: any;
  _useraccount: string = '';
  _department: string = '';
  _userid: string = '';
  _menutab:string = '';
  _type: string = '';

  checLoadedDataMenu(strloadDatamenu: any) {
    if (strloadDatamenu != '') {
      this.loaddatamenu = JSON.parse(strloadDatamenu);
      this.datamenu.forEach((o: any) => {
        this.loaddatamenu.forEach((a: any) => {
          if (o.routerLink == a.routerLink)
            o.isSelect = a.isSelect;
        });
      });
      console.log('Loaded Data Menu', this.loaddatamenu);
    }

  }

  checkUncheckAll() {
    console.log('Your Check All');
    for (var i = 0; i < this.datamenu.length; i++) {
      this.datamenu[i].isSelect = this._isselected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    console.log()
    this._isselected = this.datamenu.every(function (item: any) {
      return item.isSelect == true;
    })
    this.getCheckedItemList();
  }
  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.datamenu.length; i++) {
      if (this.datamenu[i].isSelect)
        this.checkedList.push(this.datamenu[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
  }
  closedDialog() {
    this.dialogRef.close();
  }
  submitDialogRef?: MatDialogRef<SubmitModalComponent>;
  successDialogRef?: MatDialogRef<AlertSuccessModalComponent>;
  hUpdateUserProfile() {
    if (this.checkedList == '') return;
    this.submitDialogRef = this.dialog.open(SubmitModalComponent, { data: { item: { Header: 'Please confirm', Message: `Are you want to update user access of this account?` } } });
    this.submitDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
      if (o.item.isConfirm) {
        setTimeout(() => {
          //save function
          this.performUpdateUserAccessProfile({USR_ID: this._userid, MenuTab: this.checkedList});
        }, 750);
        return;
      }
    });
  }
  performUpdateUserAccessProfile(item:any){
    rest.post('useraccess/save', item).subscribe(async (res:any) => {
      if(res.Status == 'ok'){
        this.successDialogRef = this.dialog.open(AlertSuccessModalDepartmentComponent, {data: {item: {Header: 'Success!', Message: res.Message}}})
        this.UserAccess.item.MenuTab = this.checkedList
        this.dialogRef.close(this.UserAccess.item);
      }
    })
  }

}
