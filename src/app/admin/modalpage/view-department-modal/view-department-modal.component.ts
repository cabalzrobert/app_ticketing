import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-department-modal',
  templateUrl: './view-department-modal.component.html',
  styleUrl: './view-department-modal.component.scss'
})
export class VIewDepartmentModalComponent implements OnInit {
  closeddialogNewDepartment() {
    this.diaglogRef.close();
  }
  form: FormGroup = this.fb.group({
    Departmentname: ['', Validators.required],
    DepartmentID: ''
  })
  constructor(@Inject(MAT_DIALOG_DATA) public Department: { item: any }, private fb: FormBuilder, public diaglogRef: MatDialogRef<VIewDepartmentModalComponent>) { }
  ngOnInit(): void {
    //this.form.patchValue(this.Department.item);
  }
}
