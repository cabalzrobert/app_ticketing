import { Component, HostListener, Inject, OnInit, inject } from '@angular/core';
import { GeneralService } from '../../../shared/services/general.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { AsyncSubject, Observable, ReplaySubject, empty, filter } from 'rxjs';
import { FileHandle } from 'node:fs/promises';
import { rest } from '../../../+services/services';
import { MatSelectChange } from '@angular/material/select';
import { SubmitModalComponent } from '../../modalpage/submit-modal/submit-modal.component';
import { AlertSuccessModalComponent } from '../../modalpage/alert-success-modal/alert-success-modal.component';
import { device } from '../../../tools/plugins/device';
import { LocalStorageService } from '../../../tools/plugins/localstorage';
import { jUser } from '../../../+app/user-module';
import { DataUrl, NgxImageCompressService, UploadResponse } from 'ngx-image-compress';

export interface SelectedFiles {
  name: string;
  file: any;
  filesize: string;
  base64?: string;
  uploadstatus: number;
  progress: number;
  rownum: number;
}
@Component({
  selector: 'app-newticketmodal',
  templateUrl: './newticketmodal.component.html',
  styleUrl: './newticketmodal.component.scss'
})
export class NewticketmodalComponent implements OnInit {
  PrioritylevelSelectedValue($event: MatSelectChange) {
    this.prioritylevelname = $event.source.triggerValue;
  }
  CategorySelectedValue($event: MatSelectChange) {
    this.categoryname = $event.source.triggerValue;
  }
  selectedFiles: SelectedFiles[] = [];
  selectedFiles1: SelectedFiles[] = [];
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  files: any = {};
  uploaded: any = [];
  attachment: any = [];
  categorylist: any = [];
  departments: any = [];
  personnels: any = [];
  fileSize = '';
  uploadStatus: number | undefined;
  categoryname: String = '';
  prioritylevelname: String = '';

  userDetail: any;
  loader:boolean = false;

  form: FormGroup = this.fb.group({
    Department: null,
    Category: null,
    Personnel: null,
    TitleTicket: null,
    TicketDescription: null,
    PriorityLevel: null,
    TicketAttachment: null,
    TransactionNo: null,
    TicketNo: null,
    Attachment: null
  });

  constructor(@Inject(MAT_DIALOG_DATA) public ticketdata: { item: any, Title: String, SaveButtonText: String, IsRequiredOtherDepartment: boolean }, 
  public dialog: MatDialog, public generalSerive: GeneralService, private authService: AuthService, private fb: FormBuilder, 
  public dialogRef: MatDialogRef<NewticketmodalComponent>, private ls: LocalStorageService, private imgCompress: NgxImageCompressService) { }
  HeaderTitle: String = '';
  SaveButtonText: String = '';
  async ngOnInit() {
    //console.log('this.form.value.TicketAttachment ', this.form.value.TicketAttachment);
    this.userDetail = await jUser();
    //console.log('User Detail',this.userDetail);
    //console.log('Ticket Data',this.ticketdata);
    this.form.patchValue(this.ticketdata.item);
    //console.log('this.form.value Update Modal', this.form.value);
    this.GetCategoryList({ num_row: 0, Search: '' });
    this.GetDepartmentList({ num_row: 0, Search: '' });
    this.GetDepartmentPersonnels();
    //console.log('Update Ticket Modal', this.ticketdata);
    this.HeaderTitle = this.ticketdata.Title;
    this.SaveButtonText = this.ticketdata.SaveButtonText;
    if (this.ticketdata.item != null) {
      if (this.ticketdata.item.Attachment != '')
        this.uploaded = JSON.parse(this.ticketdata.item.Attachment);

    }

    if(!this.ticketdata.IsRequiredOtherDepartment){
      // console.log('Required other department',this.ticketdata.IsRequiredOtherDepartment);
      this.form.controls['Department'].setValue(this.userDetail.DEPT_ID);
    }

    //console.log('Update Ticket Modal HeaderTitle', this.HeaderTitle);
    //console.log('Update Ticket Modal SaveButtonText', this.SaveButtonText);
    //console.log('Update Ticket Modal this.uploaded', this.uploaded);
    if (parseInt(this.uploaded.length) > 0)
      this.outputBoxVisible = true;

  }
  closedialogNewTicket(): void {
    this.uploaded = [];
    this.dialogRef.close();
  }
  submitDialogRef?: MatDialogRef<SubmitModalComponent>;
  successDialogRef?: MatDialogRef<AlertSuccessModalComponent>;
  createNewTicket(): void {
    this.loader = true;
    if (!this.isValidEntries()) return;
    //console.log('SaveButtonText', this.SaveButtonText);
    //console.log('Create New Ticket', this.form.value);
    let strheader: string = '';
    let strcontent: string = ''
    if (this.SaveButtonText == 'Create Ticket') {
      strheader = 'New Ticket';
      strcontent = 'Are you sure you want to submit a new ticket?'
    }

    else if (this.SaveButtonText == 'Update Ticket') {
      strheader = 'Update Ticket';
      strcontent = 'Are you sure you want to submit an update ticket?'
    }

    this.submitDialogRef = this.dialog.open(SubmitModalComponent, { data: { item: { Header: strheader, Message: strcontent } } });
    this.submitDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
      if (o.item.isConfirm) {
        this.performSaveTicket();
        // this.form.reset();
        return;
      }
      //console.log('Close Ticket Progress', o.item);
    });
    //this.performSaveTicket();
  }
  GetCategoryList(item: any): Observable<any> {

    if(this.ticketdata.IsRequiredOtherDepartment) return this.categorylist;
    rest.post('category/listbydepartment', {num_row: 0, Search: '', DepartmentID: this.userDetail.DEPT_ID}).subscribe(async (res: any) => {
    // rest.post('category/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.categorylist = res.category;
        //console.log('GetCategoryList inside subscribe', this.categorylist);
        return this.categorylist;
        //this.categorylist;
      }
    });
    //console.log('GetCategoryList outside subscribe', this.categorylist);
    return this.categorylist;
  }

  //added by jp july 18, 2024
  GetDepartmentList = async (item: any) => {

    if(!this.ticketdata.IsRequiredOtherDepartment) return;
    const search: any = item;
    rest.post('department/list', search).subscribe((res: any) => {
      //console.log('Department',res);
      if (res.Status === 'ok') {
        this.departments = res.department.filter((o: any) => o.DepartmentID!==this.userDetail.DEPT_ID);
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  GetDepartmentPersonnels = async () => {
    if(this.ticketdata.IsRequiredOtherDepartment) return;
    const search: any = { num_row: 0, Search: '' };
    rest.post(`head/personnels?departmentId=${this.userDetail.DEPT_ID}`).subscribe((res: any) => {
      //console.log(res);
      if (res.Status === 'ok') {
        //console.log(res.personnels)
        this.personnels = res.personnels;
        // this.personnels = this.personnels.filter((res: any) => res.userId!==this.ticketDetail?.requestId);
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  performSaveTicket() {

    // this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-exclamation', Message: 'Please check data. Try again', ButtonText: 'Error', isConfirm: false } } });
    // this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
    //   if (!o.item.isConfirm) {
    //     return;
    //   }
    // });



    rest.post('ticket/save', this.form.value).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.form.value.TransactionNo = res.Content.TransactionNo;
        this.form.value.TicketNo = res.Content.TransactionNo;
        this.form.value.IssuedDate = res.Content.IssuedDate;
        this.form.value.Status = res.Content.Status;
        this.form.value.Statusname = res.Content.Statusname;
        this.form.value.CreatedDate = res.Content.CreatedDate;
        this.form.value.Attachment = res.Content.Attachment;
        this.form.value.TicketStatus = res.Content.Status;
        this.form.value.TicketStatusname = res.Content.Statusname;


        this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-check', Message: res.Message, ButtonText: 'Success', isConfirm: true } } });
        this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
          if (o.item.isConfirm) {
            this.dialogRef.close(this.form.value);
            this.loader = false;
            return;
          }
        });
      }
      if (res.Status == 'error') {


        this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-exclamation', Message: res.Message, ButtonText: 'Error', isConfirm: false } } });
        this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
          if (!o.item.isConfirm) {
            this.loader = false;
            return;
          }
        });
      }
    }, (err: any) => {
      this.successDialogRef = this.dialog.open(AlertSuccessModalComponent, { data: { item: { Icon: 'fa fa-solid fa-exclamation', Message: 'Network Error', ButtonText: 'Error', isConfirm: false } } });
      this.successDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
        if (!o.item.isConfirm) {
          this.loader = false;
          return;
        }
      });
    });
  }

  public isValidEntries(): boolean {
    var category = this.form.value.Category;
    // if (!category) {
    //   alert('Please Select Category');
    //   return false;
    // }
    var titleticket = this.form.value.TitleTicket;
    if (!titleticket) {
      alert('Please Enter Title Ticket');
      return false;
    }
    var ticketdescription = this.form.value.TicketDescription;
    if (!ticketdescription) {
      alert('Please Enter Ticket Description');
      return false;
    }
    var prioritylevel = this.form.value.PriorityLevel;
    if (!prioritylevel) {
      alert('Please select Priority Level');
      return false
    }
    if (this.uploaded.length == 0){
      this.form.value.TicketAttachment = '';
      this.form.value.Attachment = '';
    }
      
    else if (this.uploaded.length > 0){
      this.form.value.TicketAttachment = this.uploaded.map((m: any) => m.base64);
      this.form.value.Attachment = JSON.stringify(this.form.value.TicketAttachment);
    }
      
    //this.form.value.TicketAttachment = JSON.stringify(this.uploaded);
    this.form.value.Categoryname = this.categoryname;
    this.form.value.PriorityLevelname = this.prioritylevelname;
    return true;
  }



  hRemoveItem = (item: any, idx: number) => {
    //console.log('hRemoveItem idx', idx);
    //console.log('hRemoveItem item', item);
    this.uploaded.splice(idx, 1);
    //console.log('hREmoveItem this.uploaded', this.uploaded);
  }
  uploadImage(): void {

  }

  public toFilesBase64(files: File[], selectedFiles: SelectedFiles[]): Observable<SelectedFiles[]> {
    const result = new AsyncSubject<SelectedFiles[]>();
    if (files?.length) {
      Object.keys(files)?.forEach(async (file, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          selectedFiles = selectedFiles?.filter(f => f?.name != files[i]?.name)
          selectedFiles.push({ name: files[i]?.name, filesize: `${(files[i].size / 1024).toFixed(2)} KB`, file: files[i], base64: reader?.result as string, uploadstatus: 200, progress: 200, rownum: i + 1 })
          result.next(selectedFiles);
          if (files?.length === (i + 1)) {
            result.complete();
          }
        };
      });
      return result;
    } else {
      result.next([]);
      result.complete();
      return result;
    }
  }

  public onFileSelected1(files: File[]): Observable<any[]> {
    // this.selectedFiles = []; // clear
    //console.log('onFileSelect1 files', files);
    const result = new AsyncSubject<any[]>();
    this.toFilesBase64(files, this.selectedFiles).subscribe((res: any[]) => {
      res.forEach((i: any) => this.selectedFiles1.push({ name: i.name, filesize: i.filesize, file: i.file, base64: i.base64, uploadstatus: i.uploadstatus, progress: i.progress, rownum: i.rownum }));
      //console.log('Result selectedFiles1', this.selectedFiles1);
      this.selectedFiles1.forEach((o: any) => this.uploaded.push(o));

      return res;
    });
    return result;
  }

  uploadMultipleImages(){
    this.imgCompress
    .uploadMultipleFiles()
    .then((multipleOrientedImages: UploadResponse[]) => {
      multipleOrientedImages.forEach(async (i,counter) => 
        this.imgCompress
        .compressFile(i.image, i.orientation, 50, 50)
        .then((result: DataUrl) => {
          this.uploaded.push({ name: i.fileName, filesize: `${(this.imgCompress.byteCount(result) / 1024).toFixed(2)} KB`, file: multipleOrientedImages[counter], base64: result, uploadstatus: 200, progress: 200, rownum: counter + 1 });
          this.outputBoxVisible = true;
        })
      );
      console.log('imageCompressed upload',this.uploaded)
    });
  }


  async onFileSelected(event: any): Promise<Observable<any>> {

    const result = new AsyncSubject<any[]>();
    //console.log('onFileSelect', event);
    var cntupload = this.uploaded.length + event.target.files.length;
    if (cntupload > 5) {
      alert("Only 5 files allow");
      event.preventDefault();
      event.value = "";
      return event.value;
    }
    let files = [].slice.call(event.target.files);
    this.files = files;
    //await this.onFileSelected1(files);
    device.ready(() => setTimeout(() => this.onFileSelected1(files), 275));
    console.log(this.uploaded);
    //console.log('this.selected files base64', this.selectedFiles1);
    //console.log('this.selected files base64', this.uploaded.length);
    if (this.selectedFiles1) {
      //console.log('if(this.selectedFiles1)', this.selectedFiles1.length);
      //this.selectedFiles1.forEach((o: any) => this.uploaded.push(o));
      //this.uploaded = this.selectedFiles1;
      // for (let i = 0; i < this.selectedFiles1.length; i++) {
      //   console.log('Uploaded Files  this.selectedFiles1[i].name', this.selectedFiles1[i].name);
      //   this.outputBoxVisible = false;
      //   this.progress = `0%`;
      //   this.uploadResult = '';
      //   this.fileName = '';
      //   this.fileSize = '';
      //   this.uploadStatus = undefined;

      //   const file: File = event.dataTransfer?.files[0] || event.target?.selectedFiles1[i];
      //   if (file) {
      //     this.fileName = file.name;
      //     this.fileSize = `${(file.size / 1024).toFixed(2)} KB`;
      //     this.outputBoxVisible = true;
      //   }

      //   console.log('FIles Uploaded this.selectedFiles1', this.selectedFiles1[i]);

      //   this.uploaded.push(this.listfiles(this.selectedFiles1[i], i));
      //   return this.uploaded;
      // }
    }
    //console.log('Uploaded Files', this.uploaded);


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
  private toFileBase64(item: any) {
    let stringbase64 = '';
    const reader = new FileReader();
    reader.readAsDataURL(item);
    // reader.onload = (e) => {
    //   stringbase64 = reader?.result as string;
    // }
    stringbase64 = reader?.result as string;
    return stringbase64;
  }
  @HostListener("dragover", ["$event"])
  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
  @HostListener('drop', ['$event'])
  handleDrop(event: DragEvent): Observable<any> {
    const result = new AsyncSubject<any[]>();
    event.preventDefault();
    event.stopPropagation();
    //console.log('thi.uploaded 352', this.uploaded);
    if (event.dataTransfer != null) {
      let cntuploaded: number = this.uploaded.length
      let cnt: number = event.dataTransfer.files.length;
      let totalcnt: number = cntuploaded + cnt
      if (totalcnt > 5) {
        alert("Only 5 files allow");
        return result;
      }
      let files = [].slice.call(event.dataTransfer.files);
      this.files = files;
      this.onFileSelected1(files);
      if (this.selectedFiles1) {
        //this.uploaded = this.selectedFiles1
      }
      this.outputBoxVisible = true;
      return this.uploaded
    }
    return result;
  }

}
