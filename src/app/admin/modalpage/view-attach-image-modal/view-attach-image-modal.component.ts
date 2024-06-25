import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-attach-image-modal',
  templateUrl: './view-attach-image-modal.component.html',
  styleUrl: './view-attach-image-modal.component.scss'
})
export class ViewAttachImageModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public attahcment: { item: any, Title: String }, public diaglogRef: MatDialogRef<ViewAttachImageModalComponent>) { }
  
  ngOnInit(): void {
    this.cnt = (this.attahcment.item).length
    console.log('View-attach-image-modal.components attahcment', this.attahcment.item[0]);
    this.linked = this.attahcment.item[this.index].URL;
    console.log('View-attach-image-modal.components this.cnt', this.cnt);
  }
  cnt:number = 0
  index:number = 0
  linked:string = ''
  isleft:boolean = true;
  isright:boolean = false;
  closeddialog(){
    this.diaglogRef.close();
  }
  hArrowLeft(){
    if(this.index == 0){
      this.isleft = true
      this.isright = false;
      return;
    }
    this.isright=false;
    this.isleft = false;
    this.index = this.index - 1;
    
    this.linked = this.attahcment.item[this.index].URL;
    console.log('this.index', this.index);
    if(this.index == 0){
      this.isleft = true
      this.isright = false;
      return;
    }
  }
  hArrowRight(){
    if(this.index == (this.cnt-1) ) {
      this.isright = true;
      this.isleft = false;
      return;
    }
    this.isright=false;
    this.isleft = false;
    this.index = this.index + 1
    this.linked = this.attahcment.item[this.index].URL;
    console.log('this.index', this.index);
    if(this.index == (this.cnt-1) ) {
      this.isright = true;
      this.isleft = false;
      return;
    }
    
  }
}
