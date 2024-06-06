import { Component, HostListener, OnInit, inject } from '@angular/core';
import { GeneralService } from '../../../shared/services/general.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { AsyncSubject, Observable, ReplaySubject, empty, filter } from 'rxjs';
import { FileHandle } from 'node:fs/promises';
import { rest } from '../../../+services/services';
import { MatSelectChange } from '@angular/material/select';

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
  categorylist: any = [];
  fileSize = '';
  uploadStatus: number | undefined;
  categoryname: String = '';
  prioritylevelname:String = ''

  form: FormGroup = this.fb.group({
    Category: ['', Validators.required],
    TitleTicket: ['', Validators.required],
    TicketDescription: ['', Validators.required],
    PriorityLevel: ['', Validators.required],
    TicketAttachment: ''
  });
  constructor(public generalSerive: GeneralService, private authService: AuthService, private fb: FormBuilder, public dialogRef: MatDialogRef<NewticketmodalComponent>) { }
  ngOnInit(): void {
    //console.log('this.form.value.TicketAttachment ', this.form.value.TicketAttachment);
    this.GetCategoryList({ num_row: 0, Search: '' });
  }
  closedialogNewTicket(): void {
    this.dialogRef.close();
  }
  createNewTicket(): void {
    if (!this.isValidEntries()) return;
    this.performSaveTicket();
  }
  GetCategoryList(item: any): Observable<any> {

    rest.post('category/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.categorylist = res.category;
        console.log('GetCategoryList inside subscribe', this.categorylist);
        return this.categorylist;
        //this.categorylist;
      }
    });
    console.log('GetCategoryList outside subscribe', this.categorylist);
    return this.categorylist;
  }
  performSaveTicket() {
    rest.post('ticket/save', this.form.value).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.form.value.TransactionNo = res.Content.TransactionNo;
        this.form.value.TicketNo = res.Content.TransactionNo;
        this.form.value.IssuedDate = res.Content.IssuedDate;
        this.form.value.Status = res.Content.Status;
        this.form.value.Statusname = res.Content.Statusname;
        this.form.value.CreatedDate = res.Content.CreatedDate;
        this.dialogRef.close(this.form.value);
      }
    });
  }

  public isValidEntries(): boolean {
    var category = this.form.value.Category;
    if (!category) {
      alert('Please Select Category');
      return false;
    }
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
    if (this.uploaded.length == 0)
      this.form.value.TicketAttachment = '';
    else if (this.uploaded.length > 0)
      this.form.value.TicketAttachment = JSON.stringify(this.uploaded);
    this.form.value.Categoryname = this.categoryname;
    this.form.value.PriorityLevelname = this.prioritylevelname;
    return true;
  }

  

  hRemoveItem = (item: any, idx: number) => {
    console.log('hRemoveItem idx', idx);
    console.log('hRemoveItem item', item);
    this.uploaded.splice(idx, 1);
    console.log('hREmoveItem this.uploaded', this.uploaded);
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
          console.log('sdfsdfsd sdfsdfsdfsdf sdfdsfsd', `${files[i].name}  ${(files[i].size / 1024).toFixed(2)} KB`);
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
    console.log('onFileSelect1 files', files);
    const result = new AsyncSubject<any[]>();
    this.toFilesBase64(files, this.selectedFiles).subscribe((res: any[]) => {
      res.forEach((i: any) => this.selectedFiles1.push({ name: i.name, filesize: i.filesize, file: i.file, base64: i.base64, uploadstatus: i.uploadstatus, progress: i.progress, rownum: i.rownum }));
      console.log('Result selectedFiles1', this.selectedFiles1);

      return res;
    });
    return result;
  }


  onFileSelected(event: any): Observable<any> {

    const result = new AsyncSubject<any[]>();
    console.log('onFileSelect', event);

    let files = [].slice.call(event.target.files);
    this.files = files;
    this.onFileSelected1(files);
    console.log('this.selected files base64', this.selectedFiles1);
    if (this.selectedFiles1) {
      console.log('if(this.selectedFiles1)', this.selectedFiles1);
      this.uploaded = this.selectedFiles1;
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
    console.log('Uploaded Files', this.uploaded);


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
    console.log('readAsDataURL', reader);
    reader.onload = function () {
      //console.log('getBase64', reader.result);
      file.base64 = reader.result;
      console.log('getBase64', file)
      return reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
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
    if (event.dataTransfer != null) {
      let files = [].slice.call(event.dataTransfer.files);
      this.files = files;
      this.onFileSelected1(files);
      if (this.selectedFiles1) {
        this.uploaded = this.selectedFiles1
      }
      this.outputBoxVisible = true;
      return this.uploaded
    }
    return result;
  }

}
