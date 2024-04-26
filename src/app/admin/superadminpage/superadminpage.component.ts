import { Component, ElementRef, ViewChild } from '@angular/core';
import { menusettingsbarData } from './menusettingsbarData';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewDepartmentModalComponent } from '../modalpage/new-department-modal/new-department-modal.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-superadminpage',
  templateUrl: './superadminpage.component.html',
  styleUrl: './superadminpage.component.scss'
})
export class SuperadminpageComponent {
  menuData = menusettingsbarData;
  constructor(public dialog: MatDialog) { 
    this.selectedTab = "department";
  }
  departmentDialogRef?:MatDialogRef<NewDepartmentModalComponent>;

  public selectedTab: "department" | "category" | "position" | "roles" | "useraccess";
  department: boolean = true;
  category: boolean = false;
  position: boolean = false;
  roles: boolean = false;
  useraccess: boolean = false;
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

  hDepartment() {
    this.department = true;
    this.category = false;
    this.position = false;
    this.roles = false;
    this.useraccess = false;
    this.selectedTab = "department";
  }
  hCategory() {
    this.department = false;
    this.category = true;
    this.position = false;
    this.roles = false;
    this.useraccess = false;
    this.selectedTab = "category";
  }
  hPosition() {
    this.department = false;
    this.category = false;
    this.position = true;
    this.roles = false;
    this.useraccess = false;
    this.selectedTab = "position";
  }
  hRoles() {
    this.department = false;
    this.category = false;
    this.position = false;
    this.roles = true;
    this.useraccess = false;
    this.selectedTab = "roles";
  }
  hUserAccess() {
    this.department = false;
    this.category = false;
    this.position = false;
    this.roles = false;
    this.useraccess = true;
    this.selectedTab = "useraccess";
  }

  hNewDepartment(){
    this.departmentDialogRef=this.dialog.open(NewDepartmentModalComponent);
    this.departmentDialogRef.afterClosed().pipe(filter(name => name)).subscribe(name => {
      this.departmentlist.unshift(name);
    });
  }

}
