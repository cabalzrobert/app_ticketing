import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-printticketelapsedtime-page-component',
  templateUrl: './printticketelapsedtime-page-component.component.html',
  styleUrl: './printticketelapsedtime-page-component.component.scss'
})
export class PrintticketelapsedtimePageComponentComponent implements OnInit {
  hSelectReport(item: any, idx: number) {
    this.reportlist.forEach((o:any) => o.active = false);
    item.active = true;
    //console.log('Report List', this.reportlist);
    this.dialogRef.close(item);
  }
  constructor(@Inject(MAT_DIALOG_DATA) public report: { report: any }, public dialog: MatDialog, public dialogRef: MatDialogRef<PrintticketelapsedtimePageComponentComponent>, private fb: FormBuilder) { }
  ngOnInit(): void {
    //console.log('Report', this.report);
    this.reportlist = this.report;
  }
  reportlist: any = [];
  closeddialog(): void {
    //console.log('You close this dialog');
    this.dialogRef.close();
  }
}
