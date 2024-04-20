import { Component, NgModule } from '@angular/core';
import { AuthService } from '../../../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { rest } from '../../../../+services/services';

@Component({
  selector: 'app-new-department-modal',
  templateUrl: './new-department-modal.component.html',
  styleUrl: './new-department-modal.component.scss'
})

export class NewDepartmentModalComponent {
  newdialogNewDepartment() {
    if(!this.isValidateEntries()) return;
    //console.log('New Department', this.form.value);
    this.performSaveDepartment();
  }
  form: FormGroup = this.fb.group({
    Departmentname: ['', Validators.required],
    DepartmentID: ''
  })
  constructor(private authService: AuthService, private fb: FormBuilder, public diaglogRef: MatDialogRef<NewDepartmentModalComponent>) { }
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
