import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { rest } from '../../../+services/services';

@Component({
  selector: 'app-new-category-modal',
  templateUrl: './new-category-modal.component.html',
  styleUrl: './new-category-modal.component.scss'
})
export class NewCategoryModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public Category: {item:any, Title:String}, private authService: AuthService, private fb: FormBuilder, public diaglogRef: MatDialogRef<NewCategoryModalComponent>){}
  form: FormGroup = this.fb.group({
    Categoryname: ['', Validators.required],
    CategoryID: ''
  })
  ngOnInit(): void {
    this.form.patchValue(this.Category.item);
    console.log(this.Category.item);
  }
  closeddialog(): void {
    this.diaglogRef.close();
  }

  

  newdialog() {
    if(!this.isValidateEntries()) return;
    //console.log('New Department', this.form.value);
    this.performSaveCategory();
  }

  performSaveCategory(){
    /*
    console.log('performSaveCategory', this.form.value);
    this.diaglogRef.close(this.form.value);
    */
    
    rest.post('category/save',this.form.value).subscribe(async(res:any) => {
      if(res.Status == 'ok'){
        this.form.value.CategoryID = res.Content.CategoryID
        this.diaglogRef.close(this.form.value);
      }
    })
    
  }
  public isValidateEntries():boolean{
    if(!this.form.value.Categoryname){
      alert('Please Enter Cateogry Name.');
      return false;
    }
    return true;
  }

}
