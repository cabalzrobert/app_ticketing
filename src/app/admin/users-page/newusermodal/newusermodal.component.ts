import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../../shared/services/general.service';
import { AuthService } from '../../../auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AsyncSubject, Observable, Subject, filter, takeUntil } from 'rxjs';
import { rest } from '../../../+services/services';
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { isMobileNo } from '../../../tools/global';
import { MatOptionSelectionChange } from '@angular/material/core';
import { SubmitModalComponent } from '../../modalpage/submit-modal/submit-modal.component';
import { AlertSuccessModalComponent } from '../../modalpage/alert-success-modal/alert-success-modal.component';

@Component({
  selector: 'app-newusermodal',
  templateUrl: './newusermodal.component.html',
  styleUrl: './newusermodal.component.scss',
})
export class NewusermodalComponent implements OnInit {
  GenderSelectedValue($event: MatSelectChange) {
    //this.form.value.Gendername = $event.source.triggerValue;
    this.gendername = $event.source.triggerValue;
  }
  PositionSelectedValue($event: MatSelectChange) {
    // this.form.value.Position = $event.source.triggerValue;
    this.positionname = $event.source.triggerValue;
  }
  RoleSelectedValue($event: MatSelectChange) {
    //this.form.value.Role = $event.source.triggerValue;
    this.rolename = $event.source.triggerValue;
  }
  selectedData: any = {};
  DepartmentSelectedValue($event: MatSelectChange) {
    this.departmentname = $event.source.triggerValue;
    //this.form.value.Department = $event.source.triggerValue
    // this.selectedData = {
    //   value: $event.value,
    //   text: $event.source.triggerValue
    // };
    // console.log('Selected Department $event', this.selectedData);
    //console.log('Selected Department $event', this.form.value.Department);
  }
  //today:Date | undefined;

  form: FormGroup = this.fb.group({
    UserAccountID: '',
    AccountID: '',
    DepartmentID: ['', Validators.required],
    Department: '',
    RolesID: ['', Validators.required],
    Role: '',
    PositionID: ['', Validators.required],
    Position: '',
    Firstname: ['', Validators.required],
    Middlename: ['', Validators.required],
    Lastname: ['', Validators.required],
    Gender: ['', Validators.required],
    Gendername: '',
    Birthdate: ['', Validators.required],
    MobileNumber: ['', Validators.required],
    Address: ['', Validators.required],
    ProfilePicture: '',
    LastSeen: '',
    isCommunicator: 0,
    isDepartmentHead: 0,
    //isComm:false,
    //isDeptartment: false
  });

  constructor(@Inject(MAT_DIALOG_DATA) public UserAccount: { item: any, Title: String }, private authService: AuthService, private fb: FormBuilder, public dialog: MatDialog, public dialogRef: MatDialogRef<NewusermodalComponent>, private _cdr: ChangeDetectorRef) { }

  departmentlist: any = [];
  positionlist: any = [];
  roleslist: any = []
  selectedFiles: any[] = []
  selectedFiles1: any[] = [];
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  base64 = ''
  files: any = {};
  uploaded: any = [];
  fileSize = '';
  uploadStatus: number | undefined;
  departmentname: string = '';
  rolename: string = ''
  positionname: string = ''
  gendername: string = '';

  iscommunicator: boolean = false;
  isdepthead: boolean = false;
  _isdepthead: number = 0;
  _iscommunicator: number = 0;
  private _state: any = {};
  setState(item: any) {
    for (const key of Object.keys(item)) {
      this._state[key] = item[key];
    }
  }

  @ViewChild('singleSelect') singleSelect: MatSelect | undefined;
  ngOnInit(): void {
    this.form.patchValue(this.UserAccount.item);
    this.base64 = this.form.value.ProfilePicture;
    //this.form.value.isComm = this.form.value.isCommunicator;
    //this.form.value.isDeptartment = this.form.value.isDepartmentHead;
    //this.form.value.isDepartment = this.form.value.isDepartmentHead;
    this.iscommunicator = (this.form.value.isCommunicator == 1) ? true : false;
    this.isdepthead = (this.form.value.isDepartmentHead == 1) ? true : false;
    //this.form.value.isComm = (this.form.value.isCommunicator == 1) ? true : false;
    //this.form.value.isDeptartment = (this.form.value.isDepartmentHead == 1) ? true : false;
    console.log('Checked ', this.iscommunicator, this.isdepthead);
    console.log('ngOnit newusermodal this.form', this.form.value);

    //this.form.setValue(this.UserAccount.item);
    this.GetDepartmentList({ num_row: 0, Search: '' });
    this.GetRolesList({ num_row: 0, Search: '' });
    this.GetPositionList({ num_row: 0, Search: '' });
  }

  closededialogNewUser(): void {
    this.form.value.ProfilePicture = this.base64;
    this.dialogRef.close();
  }
  onChangeCommunitcator(event: any): void {
    console.log('onClick event.checked ' + event.checked);
    //this.form.value.isDepartment = this.isdepthead;
    this.form.value.isCommunicator = (event.checked) ? 1 : 0;
    this._iscommunicator = (event.checked) ? 1 : 0;
    console.log('onClick this.form.value.isCommunicator ', this.form.value);
  }
  onChangeDeptHead(event: any): void {
    console.log('onClick event.checked ' + event.checked);
    this.form.value.isDepartmentHead = (event.checked) ? 1 : 0;
    this._isdepthead = (event.checked) ? 1 : 0;
    console.log('onClick event.checked ' + event.checked);
    console.log('onClick this.form.value.isDepartmentHead ', this.form.value, this._isdepthead);
  }
  submitDialogRef?: MatDialogRef<SubmitModalComponent>;
  successDialogRef?: MatDialogRef<AlertSuccessModalComponent>;
  CreatedialogNewUser(): void {
    this.form.value.ProfilePicture = this.base64;
    //console.log('ClosedDialogNewUser', this.form.value);
    if (!this.isValidateEntries()) return;
    //console.log('ClosedDialogNewUser', this.form.value);

    
    this.submitDialogRef = this.dialog.open(SubmitModalComponent, { data: { item: { Header: this.UserAccount.Title, Message: 'Are you sure you want to submit new user account.' } } });
    this.submitDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
      if (o.item.isConfirm) {
        setTimeout(() => this.performSaveUserAccount(), 750);
        return;
      }
      console.log('Close Ticket Progress', o.item);
    });
    // setTimeout(() => this.performSaveUserAccount(), 750);
    
  }
  performSaveUserAccount() {
    rest.post('useraccount/save', this.form.value).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.form.value.UserAccountID = res.Content.UserAccountID
        this.form.value.MobileNumber = res.Content.MobileNumber;
        this.form.value.Name = res.Content.Name;
        this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-check', Message: res.Message, ButtonText: 'Success', isConfirm: true } } });
        this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
          if (o.item.isConfirm) {
            this.dialogRef.close(this.form.value);
            return;
          }
        });
        //alert(res.Message);
        //this.dialogRef.close(this.form.value);
      }
      else if (res.Status == 'error') {
        this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-exclamation', Message: res.Message, ButtonText: 'Error', isConfirm: false } } });
        this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
          if (!o.item.isConfirm) {
            return;
          }
        });
      }
    }, (err: any) => {
      this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-exclamation', Message: 'Network Error', ButtonText: 'Error', isConfirm: false } } });
      this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
        if (!o.item.isConfirm) {
          return;
        }
      });
    })
  }
  public isValidateEntries(): boolean {
    if (!this.form.value.DepartmentID) {
      alert('Please Select Department.');
      return false;
    }
    if (!this.form.value.RolesID) {
      alert('Please Select Roles.')
      return false;
    }
    if (!this.form.value.PositionID) {
      alert("Please Select Position.");
      return false;
    }
    if (!this.form.value.Firstname) {
      alert('Please enter your FIrstname');
      return false;
    }
    if (!this.form.value.Lastname) {
      alert('Please enter Lastname');
      return false;
    }
    if (!this.form.value.MobileNumber) {
      alert('Please enter valid Mobile Number');
      return false;
    }
    if (!!this.form.value.MobileNumber) {
      if (!isMobileNo(this.form.value.MobileNumber)) {
        alert('Please enter valid Mobile Number');
        return false;
      }
    }
    //var iscommunicator = 0;

    /*
    var is_communicator = 0
    if (this.form.value.isCommunicator == 1) {
      is_communicator = 1;
    }
    var is_Department = 0;
    if (this.form.value.isDepartmentHead == 1) {
      is_Department = 1;
    }
    this.form.value.isCommunicator = is_communicator;
    this.form.value.isDepartmentHead = is_Department;
    */
    this.form.value.isCommunicator = this._iscommunicator;
    this.form.value.isDepartmentHead = this._isdepthead;
    this.form.value.Department = (!this.departmentname ? this.form.value.Department : this.departmentname);
    this.form.value.Role = (!this.rolename ? this.form.value.Role : this.rolename);
    this.form.value.Position = (!this.positionname ? this.form.value.Position : this.positionname);
    this.form.value.Gendername = (!this.gendername ? this.form.value.Gendername : this.gendername);
    console.log('isValidEntries this.form', this.form.value);
    return true
  }
  GetDepartmentList(item: any): Observable<any[]> {
    //console.log('You Select Department');
    rest.post('department/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.departmentlist = res.department;
        //this.departmentlist;
      }
    });
    return this.departmentlist;
  }

  GetPositionList(item: any): Observable<any> {

    rest.post('position/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.positionlist = res.position;
        //console.log('GetPositionList inside subscribe', this.positionlist);
        return this.positionlist;
        //this.categorylist;
      }
    });
    //console.log('GetPositionList outside subscribe', this.positionlist);
    return this.positionlist;
  }
  GetRolesList(item: any): Observable<any> {

    rest.post('roles/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.roleslist = res.roles;
        //console.log('GetPositionList inside subscribe', this.roleslist);
        return this.roleslist;
        //this.categorylist;
      }
    });
    //console.log('GetPositionList outside subscribe', this.roleslist);
    return this.roleslist;
  }
  public onFileSelected1(files: File[]): Observable<any[]> {
    // this.selectedFiles = []; // clear
    this.selectedFiles = [];
    this.selectedFiles1 = [];
    const result = new AsyncSubject<any[]>();
    this.toFilesBase64(files, this.selectedFiles).subscribe((res: any[]) => {
      res.forEach((i: any) => this.selectedFiles1.push({ name: i.name, filesize: i.filesize, file: i.file, base64: i.base64, uploadstatus: i.uploadstatus, progress: i.progress, rownum: i.rownum }));
      //console.log('Result', this.selectedFiles1);

      return res;
    });
    return result;
  }

  onFileSelected(event: any, input: HTMLInputElement): Observable<any> {
    //console.log('onFileSelected input', input.files);

    const result = new AsyncSubject<any[]>();
    //console.log('onFileSelect', event);

    let files = [].slice.call(event.target.files);
    this.files = files;
    this.onFileSelected1(files);
    console.log('this.selected files base64', this.selectedFiles1);
    if (this.selectedFiles1) {
      //console.log('if(this.selectedFiles1)', this.selectedFiles1);
      this.uploaded = this.selectedFiles1;
    }


    this.outputBoxVisible = false;
    this.progress = `0%`;
    this.uploadResult = '';
    this.fileName = '';
    this.fileSize = '';
    this.uploadStatus = undefined;

    const file: File = event.dataTransfer?.files[0] || event.target?.files[0];
    if (file) {
      this.fileName = file.name;
      this.fileSize = `${(file.size / 1024).toFixed(2)} KB`;
      this.outputBoxVisible = true;
    }
    console.log('Uploaded Files', this.uploaded);
    //this.form.value.ProfilePicture = this.uploaded[0];
    this.uploaded.forEach((i: any) => {
      this.selectedFiles1.push({ name: i.name, filesize: i.filesize, file: i.file, base64: i.base64, uploadstatus: i.uploadstatus, progress: i.progress, rownum: i.rownum });
      this.base64 = i.base64;
      console.log('Uploaded Files A this.base64', this.base64);
    });
    console.log('Uploaded Files this.selectedFiles1', this.selectedFiles1[0]);
    console.log('Uploaded Files this.base64', this.base64);
    return result
  }
  private listfiles(item: any, idx: number) {
    let rowNum = idx + 1;
    let fsize = `${(item.size / 1024).toFixed(2)} KB`

    //let base64 = this.toFileBase64(item);
    let base64 = this.getBase64(item);
    //console.log('listfiles', base64);
    return { Filename: item.name, idx: idx, uploadStatus: 199, fileSize: fsize, progress: 200, rowNum: rowNum, base64: base64 };
  }
  getBase64 = (file: any) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    //console.log('readAsDataURL', reader);
    reader.onload = function () {
      //console.log('getBase64', reader.result);
      file.base64 = reader.result;
      //console.log('getBase64', file)
      return reader.result;
    };
    reader.onerror = function (error) {
      //console.log('Error: ', error);
    };
  }

  public toFilesBase64(files: File[], selectedFiles: any[]): Observable<any[]> {
    const result = new AsyncSubject<any[]>();
    //console.log('files[0]', files[0]);
    if (files?.length) {
      Object.keys(files)?.forEach(async (file, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          //console.log('sdfsdfsd sdfsdfsdfsdf sdfdsfsd', `${files[i].name}  ${(files[i].size / 1024).toFixed(2)} KB`);
          this.selectedFiles = this.selectedFiles?.filter((f: any) => f?.name != files[i]?.name)
          this.selectedFiles.push({ name: files[i]?.name, filesize: `${(files[i].size / 1024).toFixed(2)} KB`, file: files[i], base64: reader?.result as string, uploadstatus: 200, progress: 200, rownum: i + 1 })
          result.next(this.selectedFiles);
          this.base64 = this.selectedFiles[0].base64;
          this.form.value.ProfilePicture = this.base64;
          this.setState({ form: this.form });
          //console.log('toFileBase64 selectedFiles this.selectedFiles[0].base64', this.selectedFiles[0].base64);
          if (files?.length === (i + 1)) {
            result.complete();
          }
          //this.form.value.ProfilePicture = reader?.result as string;
        };
      });
      console.log('toFileBase64 result', result);
      return result;
    } else {
      result.next([]);
      result.complete();
      return result;
    }
  }
  honDepartmentSelectChange() {
    this.form.value.ProfilePicture = this.form.value.ProfilePicture
    //console.log(this.form.value);
  }
  honDPositionSelectChange() {
    this.form.value.ProfilePicture = this.form.value.ProfilePicture
    //console.log(this.form.value);
  }
}
