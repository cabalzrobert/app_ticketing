import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewDepartmentModalComponent } from './new-department-modal/new-department-modal.component';
import { GeneralService } from '../../../shared/services/general.service';
import { filter } from 'rxjs/operators';
import { rest } from '../../../+services/services';


@Component({
  selector: 'app-settingsdepartment',
  templateUrl: './settingsdepartment.component.html',
  styleUrl: './settingsdepartment.component.scss'
})
export class SettingsdepartmentComponent implements OnInit {
btnUpdate(item: any) {
 alert(`Your Click bntUpdate ` + item.Departmentname);
}
btnView(item: any) {
  alert(`Your Click btnView ` + item.Departmentname);
}
  constructor(public dialog: MatDialog, public generalSerive:GeneralService) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  departmentDialogRef?:MatDialogRef<NewDepartmentModalComponent>;
  departmentlist:any = [
    {
      Departmentname:'Department 1',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 2',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 3',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 4',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 5',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 6',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 7',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 8',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 9',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 10',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 11',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 12',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 13',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 14',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 15',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 16',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 17',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 18',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 19',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 20',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 21',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 22',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 23',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 24',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 25',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 26',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 27',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 28',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 29',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 30',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 31',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 32',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 33',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 34',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 35',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 36',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 37',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 38',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 39',
      DepartmentID: ''
    },
    {
      Departmentname:'Department 40',
      DepartmentID: ''
    },
  ]
  NewDepartment() {
    /*
    //this.generalSerive.showDialog=false;
    this.dialog.open(NewDepartmentModalComponent, {
      width: 'fit-content',
      height: 'fit-content'
    });
    */
   this.departmentDialogRef = this.dialog.open(NewDepartmentModalComponent);
   this.departmentDialogRef.afterClosed().pipe(filter(name => name)).subscribe(name => {
    //this.departmentlist.push(name);
    this.departmentlist.unshift(name);
    this.departmentlist.
    console.log('New Department After Close name', name);
    console.log('New Department After Close this.departmentlist', this.departmentlist);
   })
  }

  public performLoadDepartment(){
    try{
      rest.post('department/list').subscribe(async(res:any) => {
        if(res.Status == 'ok')
          this.departmentlist.push(res.department);
      })
    }
    catch{}
  }

}
