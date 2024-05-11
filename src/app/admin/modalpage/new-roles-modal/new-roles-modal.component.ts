import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { rest } from '../../../+services/services';

@Component({
  selector: 'app-new-roles-modal',
  templateUrl: './new-roles-modal.component.html',
  styleUrl: './new-roles-modal.component.scss'
})
export class NewRolesModalComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public Roles:{item:any, Title:String}, private authService: AuthService, private fb:FormBuilder, public dialogRef:MatDialogRef<NewRolesModalComponent>){}
  ngOnInit(): void {
    this.form.patchValue(this.Roles.item)
  }
  form:FormGroup = this.fb.group({
    Rolesname: ['', Validators.required],
    RolesID: ''
  });
  newdialog() {
    if(!this.isValidateEntries()) return;
    this.performSave();
  }
  closeddialog() {
    this.dialogRef.close();
  }

  performSave(){
    /*
    console.log('performSaveDepartment', this.form.value);
    this.dialogRef.close(this.form.value);
    */
    
    rest.post('roles/save',this.form.value).subscribe(async(res:any) => {
      if(res.Status == 'ok'){
        this.form.value.RolesID = res.Content.RolesID
        this.dialogRef.close(this.form.value);
      }
    })
    
  }
  public isValidateEntries():boolean{
    if(!this.form.value.Rolesname){
      alert('Please Enter Roles Name.');
      return false;
    }
    return true;
  }

}
