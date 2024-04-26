import { Component, Inject, NgModule, OnInit } from '@angular/core';
//import { AuthService } from '../../../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth.service';
//import { rest } from '../../../../+services/services';
import { rest } from '../../../+services/services';

@Component({
  selector: 'app-new-department-modal',
  templateUrl: './new-department-modal.component.html',
  styleUrl: './new-department-modal.component.scss'
})

export class NewDepartmentModalComponent implements OnInit {
  newdialogNewDepartment() {
    if(!this.isValidateEntries()) return;
    //console.log('New Department', this.form.value);
    this.performSaveDepartment();
  }
  form: FormGroup = this.fb.group({
    Departmentname: ['', Validators.required],
    DepartmentID: ''
  })
  constructor(@Inject(MAT_DIALOG_DATA) public Department: {item:any}, private authService: AuthService, private fb: FormBuilder, public diaglogRef: MatDialogRef<NewDepartmentModalComponent>) { }
  ngOnInit(): void {
    //console.log('New Department Modal Component data', this.Department.Departmentname);
     this.form.patchValue(this.Department.item);
    //this.form.value.Departmentname = this.Department.item.Departmentname;
    console.log('this.form.patchValue', this.Department.item);
  }
  closeddialogNewDepartment(): void {
    this.diaglogRef.close();
  }
  performSaveDepartment(){
    console.log('performSaveDepartment', this.form.value);
    this.diaglogRef.close(this.form.value);
    /*
    rest.post('department/new',this.form.value).subscribe(async(res:any) => {
      if(res.Status == 'ok'){
        this.form.value.DepartmentID = res.Content.DepartmentID
        this.diaglogRef.close(this.form.value);
      }
    })
    */
  }
  public isValidateEntries():boolean{
    if(!this.form.value.Departmentname){
      alert('Please Enter Department Name.');
      return false;
    }
    return true;
  }
}
