import { Component, Inject, NgModule, OnInit } from '@angular/core';
//import { AuthService } from '../../../../auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth.service';
//import { rest } from '../../../../+services/services';
import { rest } from '../../../+services/services';
import { filter, map, Observable, startWith } from 'rxjs';
import { NewusermodalComponent } from '../../users-page/newusermodal/newusermodal.component';
import { MatOption, MatSelectChange } from '@angular/material/select';
import { SubmitModalComponent } from '../submit-modal/submit-modal.component';
import { AlertSuccessModalComponent } from '../alert-success-modal/alert-success-modal.component';
import { AlertSuccessModalDepartmentComponent } from '../alert-success-modal-department/alert-success-modal-department.component';
import { SubmitModalDepartmentComponent } from '../submit-modal-department/submit-modal-department.component';

@Component({
  selector: 'app-new-department-modal',
  templateUrl: './new-department-modal.component.html',
  styleUrl: './new-department-modal.component.scss'
})

export class NewDepartmentModalComponent implements OnInit {
  hCloseStaff() {
    this.searchStaff.value = ''
  }
  hSearchStaff() {
    this.GetUserAccountListStaff({ num_row: 0, DepartmentID: this.form.value.DepartmentID, Search: this.searchStaff.value });
  }
  hclose() {
    this.searchTxt.value = '';
  }
  dept: any;
  backupDept: any = {};
  hSearchDropDown() {
    this.GetDepartmentList({ num_row: 0, DepartmentID: this.form.value.DepartmentID, Search: this.searchTxt.value, AccountType: '5' });
  }

  selectedDepartmentHead: any;
  selecteddepthead: boolean = false;
  hNewDepartmentHeadselect(event: MatSelectChange) {
    //console.log('hNewDepartmentHeadSelect event', event.source.selected._element.nativeElement;);
    this.searchTxt.value = '';
    //console.log('hNewDepartment event', event.value);
    if(event.value ==  undefined) {
      this.selecteddepthead = true;
      this.form.value.DepartmentHead = '';
      this.form.value.DepartmentHeadID = '';
      console.log('hNewDepartment event Undefined', this.form.value);
    }
    else{
      const selectedDepartmentHead = {
        text: (event.source.selected as MatOption).viewValue,
        value: event.source.value
      };
      this.selecteddepthead = true;
      console.log(selectedDepartmentHead.text);
      this.form.value.DepartmentHead = selectedDepartmentHead.text;
      this.form.value.DepartmentHeadID = selectedDepartmentHead.value;
      console.log('hNewDepartment event Defined Value', this.form.value);
    }
    
  }
  submitDialogRef?: MatDialogRef<SubmitModalComponent>;
  successDialogRef?: MatDialogRef<AlertSuccessModalComponent>;
  newdialogNewDepartment() {
    if (typeof this.accountlist != "undefined" && this.accountlist != null && this.accountlist.length != null && this.accountlist.length > 0) {
      this.form.value.StaffList = JSON.stringify(this.accountlist);
    };

    if (typeof this.categorylist != "undefined" && this.categorylist != null && this.categorylist.length != null && this.categorylist.length > 0) {
      this.form.value.CategoryList = JSON.stringify(this.categorylist);
    };

    console.log('New Department', this.form.value);
    if (typeof this.categorylistremove != "undefined" && this.categorylistremove != null && this.categorylistremove.length != null && this.categorylistremove.length > 0) {
      this.form.value.CategoryListRemove = JSON.stringify(this.categorylistremove)
    };
    if (typeof this.accountlistremove != "undefined" && this.accountlistremove != null && this.accountlistremove.length != null && this.accountlistremove.length > 0) {
      this.form.value.StaffListRemove = JSON.stringify(this.accountlistremove)
    };
    //this.form.value.DepartmentHead = this.Department.item.DepartmentHead;
    //this.form.value.DepartmentHeadID = this.Department.item.DepartmentHeadID;
    if (!this.selecteddepthead) {
      this.form.value.DepartmentHeadID = this.Department.item.DepartmentHeadID;
      this.form.value.DepartmentHead = this.Department.item.DepartmentHead;
    }
    this.form.value.NoOfStaff = this.accountlist.length;
    if (!this.isValidateEntries()) return;
    //console.log('New Department', this.form.value);

    console.log('Department Head', this.form.value);
    this.submitDialogRef = this.dialog.open(SubmitModalDepartmentComponent, { data: { item: { Header: 'Please confirm', Message: 'Are you sure you want to ' + (this.Department.SaveButton).toLowerCase() + ' this department?' } } });
    this.submitDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
      if (o.item.isConfirm) {
        setTimeout(() => {
          this.performSaveDepartment();
        }, 750);
        return;
      }

    })

  }

  hSelectCategory() {
    console.log('hSelectCategory');
  }
  useraccountDialogRef?: MatDialogRef<NewusermodalComponent>;
  hNewDepartmentHead() {
    console.log('hNewDepartmentHead DepartmentID', this.form.value.DepartmentID);
    this.useraccountDialogRef = this.dialog.open(NewusermodalComponent, { data: { item: { AccountID: '', AccountType: '5', Address: '', Birthdate: '', Department: this.form.value.DepartmentName, DepartmentID: this.form.value.DepartmentID, Email: '', Firstname: 'Robert', Gender: '', Gendername: '', LastSeen: '', Lastname: 'Caballero', Middlename: '', MobileNumber: '', Position: '', PositionID: '', ProfilePicture: '', Role: '', RolesID: '', UserAccountID: '', isCommunicator: '', isDepartmentHead: '' }, Title: 'Create Department Head Account', ButtonText: 'Create', isDepartment: true } });
    //this.useraccountDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => this.usersList.unshift(o));
  }
  hNewStaff() {
    //this.DepartmentStaff.reset();
    console.log('hNewStaff', this.form.value);
    this.useraccountDialogRef = this.dialog.open(NewusermodalComponent, { data: { item: { AccountType: '6', Department: this.form.value.DepartmentName, DepartmentID: this.form.value.DepartmentID }, Title: 'Create Staff Account', ButtonText: 'Create', isDepartment: true } });


  }
  form: FormGroup = this.fb.group({
    DepartmentName: ['', Validators.required],
    DepartmentID: '',
    DepartmentHeadID: ''
  })
  filteredCountry: Observable<any[]> | undefined;
  country_lis: any = [
    { name: 'Afghanistan', code: 'AF' },
    { name: 'Åland Islands', code: 'AX' },
    { name: 'Albania', code: 'AL' },
    { name: 'Algeria', code: 'DZ' },
    { name: 'American Samoa', code: 'AS' },
    { name: 'AndorrA', code: 'AD' },
    { name: 'Angola', code: 'AO' },
    { name: 'Anguilla', code: 'AI' },
    { name: 'Antarctica', code: 'AQ' },
    { name: 'Antigua and Barbuda', code: 'AG' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Aruba', code: 'AW' },
  ];
  countryCtrl: FormControl;
  constructor(@Inject(MAT_DIALOG_DATA) public Department: { item: any, Title: String, SaveButton: String }, private authService: AuthService, private fb: FormBuilder, public dialog: MatDialog, public diaglogRef: MatDialogRef<NewDepartmentModalComponent>) {
    this.countryCtrl = new FormControl();
    this.Categoryname = new FormControl();
    this.DepartmentStaff = new FormControl();
    this.searchStaff = new FormControl();
    this.searchTxt = new FormControl();
    this.filteredCountry = this.countryCtrl.valueChanges.pipe(
      startWith(''),
      map((country) =>
        country ? this.filtercountry(country) : this.country_lis.slice()
      )
    );
  }
  searchStaff: any;
  searchTxt: any;
  departmentheadlist: any = [];
  accountliststaff: any = [];
  accountlist: any = [];
  accountlistremove: any = [];
  categorylist: any = [];
  categorylistremove: any = [];
  Categoryname: any;
  DepartmentStaff: any;
  catexist: boolean = true;
  staffexist: boolean = true;
  staffvalue: string = 'Select Staff';

  filtercountry(name: string) {
    let arr = this.country_lis.filter(
      (country: any) => country.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );

    return arr.length ? arr : [{ name: 'No Item found', code: 'null' }];
  }
  ngOnInit(): void {
    //console.log('New Department Modal Component data', this.Department.Departmentname);
    //this.form.value.Departmentname = this.Department.item.Departmentname;

    this.form.patchValue(this.Department.item);
    console.log('this.form.patchValue', this.Department);
    this.GetDepartmentList({ num_row: 0, DepartmentID: this.form.value.DepartmentID, Search: '', AccountType: '5' });
    this.GetUserAccountList({ num_row: 0, Search: '', AccountType: '6', DepartmentID: this.form.value.DepartmentID });
    this.GetUserAccountListStaff({ num_row: 0, Search: '', DepartmentID: this.form.value.DepartmentID });
    this.GetCategoryList({ DepartmentID: this.Department.item.DepartmentID, num_row: 0, Search: '' });
    console.log('Json Account List', JSON.stringify(this.accountlist));
    this.form.value.DepartmentHead = this.Department.item.DepartmentHead;
    this.form.value.DepartmentHeadID = this.Department.item.DepartmentHeadID;

    console.log('ngOnInit this.form.value)', this.form.value);


  }
  hRemoveStaff(item: any, idx: number) {
    this.accountlistremove.push(item);
    this.accountlist.splice(idx, 1);
    console.log('hRemoveStaff this.accountlistremove', this.accountlistremove);
  }
  hRemoveCategory(item: any, idx: number) {
    this.categorylistremove.push(item);
    this.categorylist.splice(idx, 1);
  }
  hSelectStaff(item: any, idx: number) {
    let isExist = this.accountlist.filter((o: any) => o.UserAccountID == item.UserAccountID)
    if (typeof isExist != "undefined" && isExist != null && isExist.length != null && isExist.length > 0) {
      this.staffexist = false
      setTimeout(() => this.DepartmentStaff.reset(), 50);;
      return
    };
    this.accountlist.push(item);
    setTimeout(() => this.DepartmentStaff.reset(), 50);;
    setTimeout(() => this.staffexist = true, 50);

  }
  hInsertCategory() {
    console.log('Key Enter', this.form.value.DepartmentID);
    console.log('Key Enter', this.Categoryname);
    let isExist: any = this.categorylist.filter((o: any) => o.Categoryname == this.Categoryname.value);
    console.log('isExist', isExist);
    if (typeof isExist != "undefined" && isExist != null && isExist.length != null && isExist.length > 0) {
      this.catexist = false
      return
    };
    this.catexist = true;
    this.categorylist.push({ DepartmentID: this.form.value.DepartmentID, Categoryname: this.Categoryname.value });
    this.Categoryname.reset();
    console.log('Key Enter Category List', this.categorylist);
  }
  GetDepartmentList(item: any): Observable<any> {
    rest.post('useraccount/departmenthead', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.departmentheadlist = res.useraccount;
        //console.log('GetPositionList inside subscribe', this.usersList);
        //this.loader = false;
        return this.departmentheadlist;
        //this.categorylist;
      }
    });
    //console.log('GetPositionList outside subscribe', this.usersList);
    return this.departmentheadlist;
  }
  GetUserAccountList(item: any): Observable<any> {
    rest.post('useraccount/departmentstaff', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.accountlist = res.useraccount;
        //console.log('GetPositionList inside subscribe', this.usersList);
        //this.loader = false;
        return this.accountlist;
        //this.categorylist;
      }
    });
    //console.log('GetPositionList outside subscribe', this.usersList);
    return this.accountlist;
  }
  GetUserAccountListStaff(item: any): Observable<any> {
    rest.post('useraccount/stafflist', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.accountliststaff = res.useraccount;
        console.log('GetPositionList inside subscribe', this.accountliststaff);
        //this.loader = false;
        return this.accountliststaff;
        //this.categorylist;
      }
    });
    //console.log('GetPositionList outside subscribe', this.usersList);
    return this.accountliststaff;
  }
  GetCategoryList(item: any): Observable<any> {
    rest.post('category/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.categorylist = res.category;
        console.log('GetPositionList inside subscribe', this.categorylist);
        //this.loader = false;
        return this.categorylist;
        //this.categorylist;
      }
    });
    //console.log('GetPositionList outside subscribe', this.usersList);
    return this.categorylist;
  }
  closeddialogNewDepartment(): void {
    this.diaglogRef.close();
  }
  performSaveDepartment() {
    /*
    console.log('performSaveDepartment', this.form.value);
    this.diaglogRef.close(this.form.value);
    */

    rest.post('department/save', this.form.value).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.successDialogRef = this.dialog.open(AlertSuccessModalDepartmentComponent, {data: {item: {Header: 'Success!', Message: res.Message}}})
        console.log('performsaveDepartment rest.Content', res.Content);
        console.log('performsaveDepartment rest.Content', res.Message);
        this.form.value.DepartmentID = res.Content.DepartmentID
        this.diaglogRef.close(this.form.value);
      }
    })

  }
  public isValidateEntries(): boolean {
    if (!this.form.value.DepartmentName) {
      alert('Please Enter Department Name.');
      return false;
    }
    return true;
  }
}
