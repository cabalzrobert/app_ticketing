import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { NewTicketDialogComponent } from './modal/new-ticket-dialog/new-ticket-dialog.component';
import { rest } from '../../+services/services';
import { tick } from '@angular/core/testing';
import moment from 'moment';
import { LocalStorageService } from '../../tools/plugins/localstorage';

//import { Observable, empty } from 'rxjs';
//import { jUser } from '../../+app/user-module';
import { stomp } from '../../+services/stomp.service';
import { timeout } from '../../tools/plugins/delay';
import { device } from '../../tools/plugins/device';

import { AsyncSubject, BehaviorSubject, Observable, Subject, empty, filter, takeUntil } from 'rxjs';
import { jUser } from '../../+app/user-module';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TicketProgressModalComponent } from '../modalpage/ticket-progress-modal/ticket-progress-modal.component';
import { ViewAttachImageModalComponent } from '../modalpage/view-attach-image-modal/view-attach-image-modal.component';
const batchDone = new Subject<boolean>();


export interface DialogData {
  Type: string,
  Message: string,
  ticketNo: string
}



@Component({
  selector: 'app-head-tickets',
  templateUrl: './head-tickets.component.html',
  styleUrl: './head-tickets.component.scss'
})
export class HeadTicketsComponent {

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private ls: LocalStorageService, private authService: AuthService) {
    this.userDetail = ls.getItem1('UserAccount');
  }
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;

  loader = true;
  height = 'height: calc(100% - 100px)';
  isTicketContentShow = false;
  batch = 0;
  collections: any = [];
  collectionreceived: any = [];
  backupCollections: any = [];
  ticketTitle = '';
  ticketDetail: any;
  personnels: any = [];
  // [
  //   {
  //     id: '00020010000001',
  //     name: 'Caballero, Robert'
  //   },
  //   {
  //     id: '00020010000003',
  //     name: 'Dela Cruz, Juan Sr. S.'
  //   }
  // ];
  userId = '';
  userDetail: any = {};
  searchValue: any;
  showProgress = false;

  _collections = Observable<any[]>;

  tab = 0;
  ticketlistcount: any = {};
  unassigend: number = 0;
  assigned: number = 0;
  alltickets: number = 0;
  subs: any = {};
  prop: any = {};

  async ngOnInit() {


    this.userDetail = await jUser();

    // this.onTabChange(0);
    //this.getDepartmentTicketCount();
    device.ready(() => this.stompWebsocketReceiver());
    if(this.authService.requesttickect){
      console.log('nisulod',this.authService.requesttickect);
      //  this.nextBatch({tab:0, search:this.authService.requesttickect.Description, IsReset: false})
       this.searchTicket(this.authService.requesttickect.Description);
    }
  }



  private async stompWebsocketReceiver() {
    //this.webSocketService.connect();
    //this.input = await jUser();
    var iscom = (this.userDetail.isCommunicator == true) ? 1 : 0;
    var isdept = (this.userDetail.isDeptartmentHead == true) ? 1 : 0;
    this.subs.wsErr = stomp.subscribe('#error', (err: any) => this.error());
    this.subs.wsConnect = stomp.subscribe('#connect', () => this.connected());
    this.subs.wsDisconnect = stomp.subscribe('#disconnect', () => this.disconnect());
    this.subs.ws1 = stomp.subscribe(`/forwardticket/depthead/${isdept}`, (json: any) => this.receivedForwardedTicket(json));
    //console.log('Communicator Component', iscom);
    stomp.ready(() => (stomp.refresh(), stomp.connect()));
  }
  collectionListDetails(item: any) {
    return item;
  }
  receivedForwardedTicket(data: any) {
    var content = data.content;
    console.log('Department Head Page', data.content);
    let ticketexist = this.collections.find((o: any) => o.ticketNo == data.ticketNo);
    if (ticketexist) return;

    this.collections.forEach((o: any) => {
      this.collectionreceived.push(this.collectionListDetails(o));
    });
    this.collections = [];
    this.collectionreceived.unshift(data.content);

    this.collectionreceived.forEach((o: any) => {
      this.collections.push(this.collectionListDetails(o));
    })
    this.collectionreceived = [];
    return this.collections;
  }

  receiveTicket(item: any): Observable<any> {
    return this.collections;
  }
  private async refreshData() {
    //jUserModify();
    this.userDetail = await jUser();
  }
  private error() {
    this.ping(() => this.testPing());
  }
  private ReceivedTest(data: any) {
    //console.log('Received Test', data);
  }
  private disconnect() {
    this.stopPing();
  }
  private testPing() {
    const { subs } = this;
    this.stopPing();
    this.ping(() => subs.tmPing = timeout(() => this.testPing(), (60000 * 1)));
  }

  private ping(callback: Function) {
    const { prop, subs } = this;
    this.stopPing();
    this.subs.ping = rest.post('ping', {}).subscribe(async (res: any) => {
      if (res.Status == 'error') {
        if (res.Type == 'device.session-end') {
          if (!!prop.IsSessionEnd) return;
        }
      }
      if (!stomp.IsConnected)
        return;
      return callback();
    }, (err: any) => {
      if (!stomp.IsConnected)
        return;
      return callback();
    });
  }
  private connected() {
    this.ping(() => this.testPing());
  }
  private stopPing() {
    const { subs } = this;
    const { tmPing, ping } = subs;
    if (tmPing) tmPing.unsubscribe();
    if (ping) ping.unsubscribe();
  }

  getDepartmentTicketCount(): Observable<any> {
    rest.post(`head/ticket/count?departmentID=${this.userDetail.DEPT_ID}`).subscribe((res: any) => {
      if (res.Status == 'ok') {
        this.ticketlistcount = res.TicketCount;
        this.unassigend = res.TicketCount.Unassigned;
        this.assigned = res.TicketCount.Assigned;
        this.alltickets = res.TicketCount.AllTickets;
      }
      console.log('Department Head Forwarded Ticket Count', this.ticketlistcount, this.unassigend, this.assigned, this.alltickets);
      return this.ticketlistcount;
    }, (err: any) => {
      alert('System Error');
    });
    console.log('Department Head Forwarded Ticket Count', this.ticketlistcount, this.unassigend, this.assigned, this.alltickets);
    return this.ticketlistcount;

    // this.onTabChange(0);
    // console.log('viewport',this.virtualScroll.getRenderedRange().end);

  }


  // onTabChange(val: any) {
  //   this.searchValue = null;
  //   this.tab = val;

  //   console.log('onTabChange this.userDetail', this.userDetail);

  //   rest.post(`head/tickets?id=${this.userDetail.DEPT_ID}&tab=${val}`).subscribe((res: any) => {
  //     if (res != null) {
  //       console.log(res);
  //       this.collections = res;
  //       this.backupCollections = res;
  //       // this.collections.forEach((e: any) => {
  //       //   e.dateCreated = moment(e.dateCreated).format('DD MMM yyyy');
  //       // });
  //       return;
  //     }
  //     alert('Failed');
  //   }, (err: any) => {
  //     alert('System Error');
  //   })

  onTabChange(val: any) {
    this.searchValue = null;
    this.tab = val;

    console.log('onTabChange this.userDetail', this.userDetail);
    rest.post(`head/tickets?id=${this.userDetail.DEPT_ID}&tab=${val}`).subscribe((res: any) => {this.loader = false; });

      // rest.post(`head/tickets?id=${this.userDetail.DEPT_ID}&tab=${val}`).subscribe((res: any) => {
      //   if (res != null) {
      //     console.log(res);
      //     this.collections = res;
      //     this.backupCollections = res;
      //     // this.collections.forEach((e: any) => {
      //     //   e.dateCreated = moment(e.dateCreated).format('DD MMM yyyy');
      //     // });
      //     return;
      //   }
      //   alert('Failed');
      // }, (err: any) => {
      //   alert('System Error');
      // })

    
   }

  async nextBatch(val: any) {
    this.loader = false;
    console.log('tab',val.tab);
    console.log(`new batch ${val.tab}`);
    console.log(`tab ${this.tab} = val.tab ${val.tab}`);
    let end = 0;
    let total = 0;
    if (this.tab !== val.tab) {
      this.collections = [];
    } else {
      end = this.virtualScroll.getRenderedRange().end;
      total = this.collections.length;
    }
    // if(val.tab===undefined) val.tab = this.tab;
    // if (!this.subs) return this.collections;
    // if (this.subs.s1) this.subs.s1.unsubscribe();
    // console.log('val.IsReset', val.IsReset);
    // console.log('this.subs.s1', this.subs.s1);
    // console.log(`total communicator next batch`);
    const filter = { tab: val.tab, departmentId: this.userDetail.DEPT_ID, row: total, search: this.searchValue };
    this.tab = val.tab;
    console.log(`end ${end} <= total ${total} : batch ${this.batch}`);
    if (end === total) {
      this.loader = true;
      console.log(filter);
      this.showProgress = true;
      await this.onPerformGetTickets(filter, this.tab);
    }

    // if(this.tab !== tab)
    //   this.batch = 0;
    // const end = this.virtualScroll.getRenderedRange().end;
    // const total = this.virtualScroll.getDataLength();
    // const filter = {tab: this.tab, departmentId: this.userDetail.DEPT_ID, row: total, search: this.searchValue};
    // console.log(`${end} <= ${total}`);
    // if(end === total){
    //   console.log(filter);
    //   rest.post('head/tickets?',filter).subscribe((res: any) => {
    //     if (res != null) {
    //       console.log('onTabChange result', res);
    //       if(res.length > 0)
    //         this.collections = this.collections.concat(res);
    //       console.log('collections batch = ',this.collections.length,this.collections);
    //       return;
    //     }
    //     alert('Failed');
    //   }, (err: any) => {
    //     alert('System Error');
    //   })
    // }
  }

  async onPerformGetTickets(filter: any, tab: any) {
    rest.post('head/tickets', filter).pipe(takeUntil(batchDone)).subscribe((res: any) => {

      if (res != null) {
        this.showProgress = false;
        batchDone.next(true);
        console.log('onTabChange result', res);
        // if (!val.IsReset || res.length < 1) this.collections = res.map((o: any) => this.collectionListDetails(o));
        // else res.forEach((o: any) => this.collections.push(this.collectionListDetails(o)));

        // return this.collections;
        if (res.length > 0)
          this.collections = this.collections.concat(res);
        console.log('collections batch = ', this.batch, this.collections);
        this.loader = false;
        this.loader = false;
        return;
      }
      else{
        this.loader = false;
        alert('Failed');
      }
        
    }, (err: any) => {
      alert('System Error');
    })
  }

  dateFormatted(isList: boolean, date: any) {
    if (isList) {
      const formattedDate = moment(date).format('D MMM');
      let splitDate = formattedDate.split(' ');
      if (splitDate[0] === '1' || splitDate[0] === '21' || splitDate[0] === '31')
        splitDate[0] = splitDate[0] + 'st';
      else if (splitDate[0] === '2' || splitDate[0] === '22')
        splitDate[0] = splitDate[0] + 'nd';
      else if (splitDate[0] === '3' || splitDate[0] === '23')
        splitDate[0] = splitDate[0] + 'rd';
      else
        splitDate[0] = splitDate[0] + 'th';

      return `${splitDate[0]} ${splitDate[1]}`;
    }
    else {
      return moment(date).format('DD MMM yyyy');
    }
  }

  getDepartmentPersonnels = async () => {
    const search: any = { num_row: 0, Search: '' };
    rest.post(`head/personnels?departmentId=${this.ticketDetail.departmentId}`).subscribe((res: any) => {
      console.log(res);
      if (res.Status === 'ok') {
        console.log(res.personnels)
        this.personnels = res.personnels;
        this.personnels = this.personnels.filter((res: any) => res.userId!==this.userDetail.USR_ID);
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  next(item: any) {
    // if(item.isAssigned) return;
    this.router.navigate([item.ticketNo], { relativeTo: this.route });
    // this.router.navigateByUrl('/head/dashboard/tickets/sample');
    this.ticketTitle = item.title;
    this.ticketDetail = item;
    console.log(this.ticketDetail);
    this.stepper.next();
    this.getCommentList(this.ticketDetail.transactionNo);
    if (!item.isAssigned)
      setTimeout(() => this.getDepartmentPersonnels());
  }

  goBack() {
    // this.router.navigate(['../tickets'], {relativeTo: this.route});
    this.router.navigate(['../assignedticket'], { relativeTo: this.route });
    this.stepper.previous();
    this.personnels = [];
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewTicketDialogComponent, {
      width: '25%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.collections = [...this.collections, result];
      console.log(this.collections);
    });
  }

  onSelectAssignee(personnel: any) {
    this.ticketDetail.assignedTo = personnel.userId;
  }

  onAssigningTicket() {
    if (!this.ticketDetail.assignedTo) return;
    const dialogRef = this.showMessageBox('progress', null, null);
    setTimeout(() => this.onSubmitAssignTicket(dialogRef), 725);
  }

  onSubmitAssignTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post('head/ticket/assign', this.ticketDetail).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been assigned.');
        dialogRef.afterClosed().subscribe(() => {
          this.goBack();
          this.collections = [];
          this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
          this.nextBatch(this.tab);
        })
        return;
      }
      ref.close();
      alert('Failed');
    }, (err: any) => {
      ref.close();
      alert('System Error!');
    });
  }

  onReturningTicket() {
    const dialogRef = this.showMessageBox('progress', null, null);
    setTimeout(() => this.onSubmitReturnTicket(dialogRef), 725);
  }

  onSubmitReturnTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post('head/ticket/return', this.ticketDetail).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been returned.');
        dialogRef.afterClosed().subscribe(() => {
          this.goBack();
          this.collections = [];
          this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
          this.nextBatch(this.tab);
        })
        return;
      }
      ref.close();
      alert('Failed');
    }, (err: any) => {
      ref.close();
      alert('System Error!');
    });
  }


  forwardingTicket() {
    const dialogRef = this.dialog.open(ForwardDialog, {
      data: { ticketNo: this.ticketDetail.ticketNo }
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.ticketDetail.isForwarded = true;
      }
    });
  }

  onResolvingTicket() {
    const dialogRef = this.showMessageBox('confirmation', this.ticketDetail.ticketNo, null);
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result) {
        this.ticketDetail.status = 6;
        // this.goBack();
        // this.onTabChange(this.tab);

      }
    })
  }

  cancel = async () => {
    rest.post(`head/ticket/cancel?ticketNo=${this.ticketDetail.ticketNo}`,{}).subscribe((res: any) => {
      if (res.Status === 'ok') {
        this.ticketDetail.status = 3;
        return;
      }
      alert('Failed');
    }, (err: any) => {
      alert('System Error!');
    });
  }

  // onPerformResolveTicket(ref: MatDialogRef<MessageBoxDialog>) {
  //   rest.post(`head/ticket/resolve?ticketNo=${this.ticketDetail.ticketNo}`).subscribe((res: any) => {
  //     if (res.Status === 'ok') {
  //       ref.close();
  //       const dialogRef = this.showMessageBox('message', 'Ticket has been resolved.');
  //       dialogRef.afterClosed().subscribe(() => {
  //         this.goBack();
  //         this.onTabChange(this.tab);
  //       })
  //       return;
  //     }
  //     alert('Failed');
  //     ref.close();
  //   }, (err: any) => {
  //     alert('System Error!');
  //     ref.close();
  //   })
  // }


  // searchTicket(val: string) {
  //   this.collections = this.backupCollections;
  //   this.collections = this.collections.filter((i: any) => i.title.includes(val));
  //   console.log(this.collections);
  // }
  searchTicket(val: string) {
    try {
      this.searchValue = !val ? null : val;
      this.collections = [];
      this.virtualScroll.setRenderedRange({ start: 0, end: 0 });
      this.nextBatch({tab: this.batch});
    } catch (error) {
      
    }
    // this.collections = this.backupCollections;
    // this.collections = this.collections.filter((i:any)=>i.title.includes(val));
    // console.log(this.collections);

  }

  showMessageBox(type: string, ticketNo: any, message: any): any {
    return this.dialog.open(MessageBoxDialog, {
      disableClose: true,
      width: type !== 'progress' ? '20%' : 'auto',
      data: { Type: type, Message: message, ticketNo: ticketNo }
    });
  }



  public tabsContentRefComment!: ElementRef;
  resolveticketDialogRef?: MatDialogRef<TicketProgressModalComponent>;
  ticketViewAttachment?: MatDialogRef<ViewAttachImageModalComponent>;

  ticketcomment: any = [];
  ticketcommentAttacheImage: any = [];
  ticketImageAttachment: any = [];
  resolveEvents: number = 0;
  ticketindex: number = 0;

  pending: string = '';
  resolve: string = '';
  allticket: string = '';
  ticketcount: any = [];
  ticketpending: any = [];


  base64 = '';
  attahcment: any = [];
  input1: any = {};
  files: any = {};
  selectedFiles: any[] = [];
  selectedFiles1: any[] = [];
  uploaded: any = [];
  viewRequestorPage: boolean = false;
  viewTicketComment: boolean = true;
  tickettitle: string = '';
  TicketDescription: string = '';
  TransactionNo: String = ''
  TicketNo: String = '';
  CreatedDate: String = '';
  TicketStatus: Number = 0;
  Status: Number = 0;
  TicketStatusname: String = '';
  PriorityLevelname: String = '';
  isAssigned: boolean = false;
  AssignedAccount: String = '';
  AssignedAccountname: String = '';
  LastMessage: String = '';
  DepartmenName: String = '';
  DepartmentID: String = ''
  AssignedAccountEmail: String = ''
  AssignedAccountProfilePicture: String = ''
  ticketupdate: any = {};
  public commentform = new FormGroup({
    Message: new FormControl(),
    FileAttachment: new FormControl()
  })

  getCommentList(TransactionNo: String): Observable<any> {
    rest.post('ticket/commentlist?TransactionNo=' + TransactionNo).subscribe(async (res: any) => {
      this.ticketcomment = res.Comment;
      let last = this.ticketcomment[parseInt(this.ticketcomment.length) - 1];
      //moment(date).format('DD MMM yyyy')
      console.log('let last message', moment(last.CommentDate).format('DD MMM yyyy'));
      console.log('let last message', last);
      this.LastMessage = last.CommentDate;
      //await this.getlastMessage(moment(last.CommentDate).format('DD MMM yyyy'));
      return this.ticketcomment;
    });
    return this.ticketcomment;
  }

  hSendComment() {
    console.log('hSendComment', this.commentform.controls["Message"].value);
    if (!this.commentform.value.Message) {
      alert('Invalid Message')
      return;
    }
    this.performSendComment({ TransactionNo: this.TransactionNo, Message: this.commentform.controls["Message"].value, isImage: false, isFile: false, isRead: false, isMessage: true, FileAttachment: this.commentform.value.FileAttachment });
    this.commentform.reset();
  }

  performSendComment(item: any) {
    console.log('performSendComment item', item.FileAttachment);
    rest.post('ticket/msg/send', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        //res.Content.forEach((o:any) => this.ticketImageAttachment.push(this.ticketCommentListDetails(0)));
        this.ticketcomment.push(this.ticketCommentListDetails(res.Content));
        //console.log('performSendComment', this.ticketcomment);
        return this.ticketcomment
      }
      else {
        alert(res.Message);
      }
    });
  }

  ticketCommentListDetails(item: any) {
    console.log('ticketCommentListDetails', item);
    return ({ Branch_ID: item.Branch_ID, CommentDate: item.CommentDate, CommentID: item.CommentID, Company_ID: item.Company_ID, Department: '', DisplayName: item.DisplayName, FileAttachment: item.FileAttachment, ImageAttachment: item.ImageAttachment, IsYou: true, Message: item.Message, ProfilePicture: item.ProfilePicture, SenderID: item.SenderID, TransactionNo: item.TransactionNo, isFile: item.isFile, isImage: item.isImage, isMessage: item.isMessage, isRead: false })
  }

  async onFileSelected(event: any, input: HTMLInputElement) {
    //this.ticketcomment = [];
    //return this.ticketcomment;

    await this.onFileSelectedComment(event, input);
    //console.log('onFileSelect 70', this.ticketcomment);
    this.ticketcomment.forEach((o: any) => this.ticketcommentAttacheImage.push(o));

    //console.log('onFileSelect 70', this.ticketcommentAttacheImage);
    //this.ticketcomment = [];
    device.ready(() => setTimeout(() => this.performSendCommentImage(this.input1), 275));
    //this.ticketcomment = [];
    //this.ticketcommentAttacheImage.forEach((o:any) => this.ticketcomment.push(o));

    this.commentform.reset();
    this.scrollToBottom();
    return this.ticketcomment;
  }

  scrollToBottom() {
    const el: HTMLDivElement = this.tabsContentRefComment.nativeElement;
    el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
  }

  performSendCommentImage(item: any) {
    console.log('performSendComment item', item.FileAttachment);
    rest.post('ticket/msg/send', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        //res.Content.forEach((o:any) => this.ticketImageAttachment.push(this.ticketCommentListDetails(0)));

        //this.ticketcommentAttacheImage.unshift( this.ticketCommentListDetails(res.Content));
        //batchDone.next(true);
        this.ticketcommentAttacheImage.push(this.ticketCommentListDetails(res.Content));
        this.ticketcommentAttacheImage.forEach((o: any) => this.ticketcomment.push(setTimeout(() => this.ticketCommentListDetails(o), 275)));

        //console.log('performSendCommentImage this.ticketImageAttachment 1848', this.ticketcommentAttacheImage);
        //this.ticketcomment = [];
        //this.ticketcommentAttacheImage.forEach((o:any) => this.ticketcomment.push(o));
        //console.log('performSendCommentImage this.ticketImageAttachment 1854', this.ticketcomment);
        //console.log('performSendComment', this.ticketcomment);
        console.log('performSendComment 1864', this.ticketcomment);
        //this.ticketcomment = this.ticketcomment.concat(this.ticketcommentAttacheImage);
        this.ticketcomment = this.ticketcommentAttacheImage;
        console.log('performSendComment 1864', this.ticketcomment);

        return this.ticketcomment;
      }
      else {
        alert(res.Message);
      }
    });
  }

  onFileSelectedComment(event: any, input: HTMLInputElement): Promise<Observable<any>> {
    this.uploaded = [];
    this.selectedFiles = [];
    this.selectedFiles1 = [];
    const result = new AsyncSubject<any[]>();
    var cntupload = this.uploaded.length + event.target.files.length;
    if (cntupload > 5) {
      event.preventDefault();
      event.value = "";
      return event.value;
    }
    let files = [].slice.call(event.target.files);
    this.files = files;
    this.onFileSelected1(files);
    if (this.selectedFiles1) {
      this.uploaded = this.selectedFiles1;
    }

    const file: File = event.dataTransfer?.files[0] || event.target?.files[0];
    event.value = '';
    this.input1.TransactionNo = this.TransactionNo;
    this.input1.Message = this.commentform.controls["Message"].value;
    this.input1.isImage = true;
    this.input1.isFile = false;
    this.input1.isMessage = false;
    this.input1.FileAttachment = this.base64;
    console.log('tthis.uploaded 99', this.selectedFiles1.length);
    console.log('this.input1 38', this.input1);
    return this.uploaded
  }

  public onFileSelected1(files: File[]): Observable<any[]> {
    // this.selectedFiles = []; // clear
    console.log('onFileSelect1 files', files.length);
    const result = new AsyncSubject<any[]>();
    this.toFilesBase64(files, this.selectedFiles).subscribe((res: any[]) => {
      res.forEach((i: any) => this.selectedFiles1.push({ name: i.name, filesize: i.filesize, file: i.file, base64: i.base64, uploadstatus: i.uploadstatus, progress: i.progress, rownum: i.rownum }));
      //res.forEach((i:any) => this.attahcment.push(i.base64));
      console.log('Result selectedFiles1', this.selectedFiles1);
      if (this.onFileSelected1.length > 0) {
        this.input1.TransactionNo = this.TransactionNo;
        this.input1.Message = 'ATTACH IMAGE';
        this.input1.isImage = true;
        this.input1.isFile = false;
        this.input1.isMessage = false;
        this.input1.FileAttachment = this.selectedFiles1.map((m: any) => m.base64);
        console.log('this.input1 113', this.input1);
        //this.performSendComment(this.input1);
      }



      return this.selectedFiles1;
    });
    return result;
  }

  public toFilesBase64(files: File[], selectedFiles: any[]): Observable<any[]> {
    const result = new AsyncSubject<any[]>();
    if (files?.length) {
      Object.keys(files)?.forEach(async (file, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          selectedFiles = selectedFiles?.filter(f => f?.name != files[i]?.name)
          selectedFiles.push({ name: files[i]?.name, filesize: `${(files[i].size / 1024).toFixed(2)} KB`, file: files[i], base64: reader?.result as string, uploadstatus: 200, progress: 200, rownum: i + 1 })
          this.attahcment.push(reader?.result as string);
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

  hDeclinedProgress() {
    this.resolveEvents = 0;
    this.openpopticketprogress(this.resolveEvents, 'Declined');
  }
  hAcceptProgress() {
    this.resolveEvents = 1;
    this.openpopticketprogress(this.resolveEvents, 'Accept');
  }

  openpopticketprogress(ActionEvent: number, Title: String = '') {
    const _data: any = {};
    let title: String = ''
    _data.TransactionNo = this.TransactionNo;
    _data.TicketNo = this.TicketNo;
    _data.ActionEvent = ActionEvent;
    _data.Status = 4;
    title = Title;
    if (ActionEvent == 0) {
      _data.Status = 3
    }
    // else if(ActionEvent == 1)
    //   _data.Status = 4
    console.log('openpopticketprogress', _data, title);



    this.resolveticketDialogRef = this.dialog.open(TicketProgressModalComponent, { data: { item: _data, Title: title } });
    if (this.resolveEvents == 1) {
      this.resolveticketDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {

        console.log('Close Ticket Progress', o);
        console.log('Close Ticket Progress this.ticketindex', this.ticketindex);
        this.Status = o.Status;
        this.hRemoveItem();
        //this.ticketpending.slice(this.ticketindex,1);
        //console.log('Close Ticket Progress this.ticketpending', this.ticketpending);
      });
    }
    else {
      this.resolveticketDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {

        //console.log('Close Ticket Progress', o);
        //console.log('Close Ticket Progress this.ticketindex', this.ticketindex);
        this.Status = o.Status;
        //this.hRemoveItem();
        //this.ticketpending.slice(this.ticketindex,1);
        //console.log('Close Ticket Progress this.ticketpending', this.ticketpending);
      });
    }
  }

  hRemoveItem() {
    this.ticketpending.splice(this.ticketindex, 1);
    this.pending = (parseInt(this.pending) - 1).toString();
    this.resolve = (parseInt(this.resolve) + 1).toString();
  }
}



@Component({
  selector: 'app-message-box-dialog',
  templateUrl: 'modal/message-box-dialog.html',
  styleUrl: 'modal/message-box-dialog.scss',
})
export class MessageBoxDialog {

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<HeadTicketsComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  confirm() {
    const dialogRef = this.showMessageBox('progress', null, null);
    setTimeout(() => this.onPerformResolveTicket(dialogRef), 725);
  }

  onPerformResolveTicket(ref: MatDialogRef<MessageBoxDialog>) {
    rest.post(`head/ticket/resolve?ticketNo=${this.data.ticketNo}`).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been resolved.');
        dialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close(true);
        })
        return;
      }
      alert('Failed');
      ref.close();
    }, (err: any) => {
      alert('System Error!');
      ref.close();
    })
  }

  showMessageBox(type: string, ticketNo: any, message: any): any {
    return this.dialog.open(MessageBoxDialog, {
      disableClose: true,
      width: type !== 'progress' ? '20%' : 'auto',
      data: { Type: type, Message: message, ticketNo: ticketNo }
    });
  }
}

@Component({
  selector: 'app-forward-dialog',
  templateUrl: 'modal/forward-dialog.html',
  styleUrl: 'modal/forward-dialog.scss',
})
export class ForwardDialog {

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<HeadTicketsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  departments: any = [];
  personnels: any = [];
  forwardData: any = {};

  ngOnInit() {
    setTimeout(() => this.getDepartmentList());
  }


  getDepartmentList = async () => {
    const search: any = { num_row: 0, Search: '' };
    rest.post('department/list', search).subscribe((res: any) => {
      console.log(res);
      if (res.Status === 'ok') {
        this.departments = res.department;
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  getDepartmentPersonnels = async () => {
    const search: any = { num_row: 0, Search: '' };
    rest.post(`head/personnels?departmentId=${this.data.forwardDepartment}`).subscribe((res: any) => {
      console.log(res);
      if (res.Status === 'ok') {
        this.personnels = res.personnels;
        return;
      }
      alert('Failed to load');
    }, (error: any) => {
      alert('System Error!');
    });
  }

  selectDepartment(val: string) {
    this.data.forwardDepartment = val;
    setTimeout(() => this.getDepartmentPersonnels());
  }

  selectPersonnel(val: string) {
    this.data.forwardTo = val;
  }

  setRemarks(val: string) {
    this.data.forwardRemarks = val;
  }

  onConfirmForwardTicket() {
    const dialogRef = this.showMessageBox('progress', null, null);
    this.data.status = 3;
    setTimeout(() => this.onPerformConfirmForwardTicket(dialogRef), 725);
  }

  onPerformConfirmForwardTicket(ref: MatDialogRef<MessageBoxDialog>) {
    // ref.close();
    // const dialogRef = this.showMessageBox(false,true,'Ticket has been forwarded.');
    // dialogRef.afterClosed().subscribe((result: any)=>{
    //   this.dialogRef.close();
    // });
    rest.post('head/ticket/forward', this.data).subscribe((res: any) => {
      if (res.Status === 'ok') {
        ref.close();
        const dialogRef = this.showMessageBox('message', null, 'Ticket has been forwarded.');
        dialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close(this.data);
        })
        return;
      }
      ref.close();
      alert('Failed');
    }, (err: any) => {
      ref.close();
      alert('System Error!');
    });
  }

  showMessageBox(type: string, ticketNo: any, message: any): any {
    return this.dialog.open(MessageBoxDialog, {
      disableClose: true,
      width: type !== 'progress' ? '20%' : 'auto',
      data: { Type: type, Message: message, ticketNo: ticketNo }
    });
  }
}
