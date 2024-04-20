import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../../shared/services/general.service';
import { AuthService } from '../../../auth.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-newusermodal',
  templateUrl: './newusermodal.component.html',
  styleUrl: './newusermodal.component.scss'
})
export class NewusermodalComponent implements OnInit {
  //today:Date | undefined;
  constructor(private authService: AuthService, private fb: FormBuilder, public dialogRef: MatDialogRef<NewusermodalComponent>) { }
  ngOnInit(): void {
    //this.today = new Date();
  }

  closededialogNewUser(): void {
    this.dialogRef.close();
  }
}
