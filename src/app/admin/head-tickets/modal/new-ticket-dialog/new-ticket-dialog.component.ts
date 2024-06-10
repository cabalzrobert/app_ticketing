import { Component, Inject } from '@angular/core';
import { HeadTicketsComponent } from '../../head-tickets.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { stringify } from 'node:querystring';
import { rest } from '../../../../+services/services';

export interface DialogData {
  ticketNo: string;
  categoryId: string;
  title: string;
  description: string;
  attachments: [];
  priorityLevel: number;
  priorityName: string;
}

@Component({
  selector: 'app-new-ticket-dialog',
  templateUrl: './new-ticket-dialog.component.html',
  styleUrl: './new-ticket-dialog.component.scss'
})

export class NewTicketDialogComponent {
  files: any = [];
  category = [
    {
      id: '0001',
      name: 'Category 1'
    },
    {
      id: '0002',
      name: 'Category 2'
    },
    {
      id: '0003',
      name: 'Category 3'
    }
  ];

  // ticketDetail: any = {};
  errorMessage = '';

  constructor(private dialogRef: MatDialogRef<NewTicketDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onFileUpload(event: any){
    let files: Array<any> = event.target.files;
    for(const item of files){
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadSimulator(0);
  }

  uploadSimulator(index: number){
    if(index === this.files.length) return;

    const interval = setInterval(() => {
      if(this.files[index].progress === 100){
        clearInterval(interval);
        this.uploadSimulator(index + 1);
      }
      else{
        this.files[index].progress += 25;
      }
    },100);
  }

  onFileDelete(index: number){
    this.files.splice(index, 1);
  }

  formatBytes(bytes: any, decimals?: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  selectCategory(val: string){
    this.data.categoryId = val;
  }
  
  setTitle(val: string){
    this.data.title = val;
  }

  setDescription(val: string){
    this.data.description = val;
  }

  selectPriorityLevel(val: number){
    this.data.priorityLevel = val;
    this.data.priorityName = +val===0?'Low':+val===1?'Medium':'Urgent';
  }

  formValidation(): boolean{
    let isValid = true;

    if(!this.data.categoryId || 
      !this.data.title || 
      !this.data.description 
      // !this.data.priorityLevel
    ){
      this.errorMessage = 'Please input required fields';
      alert(JSON.stringify(this.data) + this.errorMessage);
      isValid = false;
    }

    this.data.ticketNo = Math.floor(100000000 + Math.random() * 899999999).toString();

    return isValid;
  }

  onSubmitTicketDetail = async () => {
    rest.post('ticket/add',this.data).subscribe((res: any)=>{
      if(res.Status === 'ok'){
        return this.dialogRef.close(this.data);
      }
      alert('Failed to create a ticket');
    },(err:any)=>{
      alert('System Error');
    });
  }


  onCreateTicket() {
    if(!this.formValidation()) return;
    setTimeout(()=>this.onSubmitTicketDetail(),725);
  }

  // onDrop(event: any){
  //   alert(event);
  // }

}
