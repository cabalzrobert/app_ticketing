import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { menusettingsbarData } from './menusettingsbarData';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewDepartmentModalComponent } from '../modalpage/new-department-modal/new-department-modal.component';
import { filter } from 'rxjs/operators';
import { VIewDepartmentModalComponent } from '../modalpage/view-department-modal/view-department-modal.component';
import { NewCategoryModalComponent } from '../modalpage/new-category-modal/new-category-modal.component';
import { ViewCategoryModalComponent } from '../modalpage/view-category-modal/view-category-modal.component';
import { NewPositionModalComponent } from '../modalpage/new-position-modal/new-position-modal.component';
import { ViewPositionModalComponent } from '../modalpage/view-position-modal/view-position-modal.component';
import { NewRolesModalComponent } from '../modalpage/new-roles-modal/new-roles-modal.component';
import { ViewRolesModalComponent } from '../modalpage/view-roles-modal/view-roles-modal.component';
import { AuthService } from '../../auth.service';
import { rest } from '../../+services/services';
import { timeout } from '../../tools/plugins/delay';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

interface MenuNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-superadminpage',
  templateUrl: './superadminpage.component.html',
  styleUrl: './superadminpage.component.scss'
})
export class SuperadminpageComponent implements OnInit {
  

  menuData = menusettingsbarData;
  constructor(public dialog: MatDialog, private authService: AuthService) {
    this.selectedTab = "department";
    this.SearchDepartment = new FormControl();
    this.SearchCategory = new FormControl();
    this.SearchPosition = new FormControl();
    this.SearchRoles = new FormControl();
  }
  SearchDepartment: any = {};
  SearchCategory: any = {};
  SearchPosition: any = {};
  SearchRoles: any = {};
  ngOnInit(): void {
    //this.hCategory();
    this.onScreenSize();
    this.hDepartment();
  }


  onWindowInitialize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.changeclass = false;
    }
    else if (this.screenWidth > 768 && this.screenWidth <= 1300) {
      this.changeclass = true
    }

    else {

      this.changeclass = false;
      this.collapsed = true;
    }
  }

  collapsed = false;
  screenWidth = 0;
  changeclass = false;
  @HostListener('window:resize', ['$event'])
  //@Output() onToggleSideNav: EventEmitter<MenuNavToggle> = new EventEmitter();
  //screenWidth = 0;
  onScreenSize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.changeclass = false;
    }
    else if (this.screenWidth > 768 && this.screenWidth <= 1300) {
      this.changeclass = true
    }

    else {

      this.changeclass = false;
      this.collapsed = true;
    }
  }
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.changeclass = false;
    }
    else if (this.screenWidth > 768 && this.screenWidth <= 1300) {
      this.changeclass = true
    }

    else {

      this.changeclass = false;
      this.collapsed = true;
    }


    console.log('onResize', event, ' this.screenWidth', this.screenWidth);
  }
  @Output() onToggleSideNav: EventEmitter<MenuNavToggle> = new EventEmitter();


  departmentDialogRef?: MatDialogRef<NewDepartmentModalComponent>;
  departmentviewDialogRef?: MatDialogRef<VIewDepartmentModalComponent>;

  newcategoryDialogref?: MatDialogRef<NewCategoryModalComponent>;
  viewcategoryDialogref?: MatDialogRef<ViewCategoryModalComponent>;

  newpositionDialogref?: MatDialogRef<NewPositionModalComponent>;
  viewpositionDialogref?: MatDialogRef<ViewPositionModalComponent>;

  newrolesDialogref?: MatDialogRef<NewRolesModalComponent>;
  viewrolesDialogref?: MatDialogRef<ViewRolesModalComponent>;

  public selectedTab: "department" | "category" | "position" | "roles" | "useraccess";
  department: boolean = true;
  category: boolean = false;
  position: boolean = false;
  roles: boolean = false;
  useraccess: boolean = false;
  categorylist1: any = [
    {
      Categoryname: 'Category 1',
      CateogryID: '1'
    },
    {
      Categoryname: 'Category 2',
      CateogryID: '2'
    },
    {
      Categoryname: 'Category 3',
      CateogryID: '3'
    },
    {
      Categoryname: 'Category 4',
      CateogryID: '4'
    },
    {
      Categoryname: 'Category 5',
      CateogryID: '5'
    },
    {
      Categoryname: 'Category 6',
      CateogryID: '6'
    },
    {
      Categoryname: 'Category 7',
      CateogryID: '7'
    },
    {
      Categoryname: 'Category 8',
      CateogryID: '8'
    },
    {
      Categoryname: 'Category 10',
      CateogryID: '10'
    },
    {
      Categoryname: 'Category 11',
      CateogryID: '11'
    },
    {
      Categoryname: 'Category 12',
      CateogryID: '12'
    },
    {
      Categoryname: 'Category 13',
      CateogryID: '13'
    },
    {
      Categoryname: 'Category 14',
      CateogryID: '14'
    },
    {
      Categoryname: 'Category 15',
      CateogryID: '15'
    },
    {
      Categoryname: 'Category 16',
      CateogryID: '16'
    },
    {
      Categoryname: 'Category 17',
      CateogryID: '17'
    },
    {
      Categoryname: 'Category 18',
      CateogryID: '18'
    },
    {
      Categoryname: 'Category 19',
      CateogryID: '19'
    },
    {
      Categoryname: 'Category 20',
      CateogryID: '20'
    },
    {
      Categoryname: 'Category 21',
      CateogryID: '21'
    },
    {
      Categoryname: 'Category 22',
      CateogryID: '22'
    },
    {
      Categoryname: 'Category 23',
      CateogryID: '23'
    },
    {
      Categoryname: 'Category 24',
      CateogryID: '24'
    },
    {
      Categoryname: 'Category 25',
      CateogryID: '25'
    },
    {
      Categoryname: 'Category 26',
      CateogryID: '26'
    },
    {
      Categoryname: 'Category 27',
      CateogryID: '27'
    },
    {
      Categoryname: 'Category 28',
      CateogryID: '28'
    },
    {
      Categoryname: 'Category 29',
      CateogryID: '29'
    },
    {
      Categoryname: 'Category 30',
      CateogryID: '30'
    },
    {
      Categoryname: 'Category 31',
      CateogryID: '31'
    },
    {
      Categoryname: 'Category 32',
      CateogryID: '32'
    },
    {
      Categoryname: 'Category 33',
      CateogryID: '33'
    },
    {
      Categoryname: 'Category 34',
      CateogryID: '34'
    },
    {
      Categoryname: 'Category 35',
      CateogryID: '35'
    },
    {
      Categoryname: 'Category 36',
      CateogryID: '36'
    },
    {
      Categoryname: 'Category 37',
      CateogryID: '37'
    },
    {
      Categoryname: 'Category 38',
      CateogryID: '38'
    },
    {
      Categoryname: 'Category 39',
      CateogryID: '39'
    },
    {
      Categoryname: 'Category 40',
      CateogryID: '40'
    },
  ];
  departmentlist1: any = [
    {
      Departmentname: 'Department 1',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 2',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 3',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 4',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 5',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 6',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 7',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 8',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 9',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 10',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 11',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 12',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 13',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 14',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 15',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 16',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 17',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 18',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 19',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 20',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 21',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 22',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 23',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 24',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 25',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 26',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 27',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 28',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 29',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 30',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 31',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 32',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 33',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 34',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 35',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 36',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 37',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 38',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 39',
      DepartmentID: ''
    },
    {
      Departmentname: 'Department 40',
      DepartmentID: ''
    },
  ];
  positionlist1: any = [
    {
      PositionID: '1',
      Positionname: 'Position 1'
    }, {
      PositionID: '2',
      Positionname: 'Position 2'
    }, {
      PositionID: '3',
      Positionname: 'Position 3'
    }, {
      PositionID: '4',
      Positionname: 'Position 4'
    }, {
      PositionID: '5',
      Positionname: 'Position 5'
    }, {
      PositionID: '6',
      Positionname: 'Position 6'
    }, {
      PositionID: '7',
      Positionname: 'Position 7'
    }, {
      PositionID: '8',
      Positionname: 'Position 8'
    }, {
      PositionID: '9',
      Positionname: 'Position 9'
    }, {
      PositionID: '10',
      Positionname: 'Position 10'
    }, {
      PositionID: '11',
      Positionname: 'Position 11'
    }, {
      PositionID: '12',
      Positionname: 'Position 12'
    }, {
      PositionID: '13',
      Positionname: 'Position 13'
    }, {
      PositionID: '14',
      Positionname: 'Position 14'
    }, {
      PositionID: '15',
      Positionname: 'Position 15'
    }, {
      PositionID: '16',
      Positionname: 'Position 16'
    }, {
      PositionID: '17',
      Positionname: 'Position 17'
    }, {
      PositionID: '18',
      Positionname: 'Position 18'
    }, {
      PositionID: '19',
      Positionname: 'Position 19'
    }, {
      PositionID: '20',
      Positionname: 'Position 20'
    }, {
      PositionID: '21',
      Positionname: 'Position 21'
    }, {
      PositionID: '22',
      Positionname: 'Position 22'
    }, {
      PositionID: '23',
      Positionname: 'Position 23'
    }, {
      PositionID: '24',
      Positionname: 'Position 24'
    }, {
      PositionID: '25',
      Positionname: 'Position 25'
    }, {
      PositionID: '26',
      Positionname: 'Position 26'
    }, {
      PositionID: '27',
      Positionname: 'Position 27'
    }, {
      PositionID: '28',
      Positionname: 'Position 28'
    }, {
      PositionID: '29',
      Positionname: 'Position 29'
    }, {
      PositionID: '30',
      Positionname: 'Position 30'
    }, {
      PositionID: '31',
      Positionname: 'Position 31'
    }, {
      PositionID: '32',
      Positionname: 'Position 32'
    }, {
      PositionID: '33',
      Positionname: 'Position 33'
    }, {
      PositionID: '34',
      Positionname: 'Position 34'
    }, {
      PositionID: '35',
      Positionname: 'Position 35'
    }, {
      PositionID: '36',
      Positionname: 'Position 36'
    }, {
      PositionID: '37',
      Positionname: 'Position 37'
    }, {
      PositionID: '38',
      Positionname: 'Position 38'
    }, {
      PositionID: '39',
      Positionname: 'Position 39'
    }
  ];
  roleslist1: any = [
    {
      'RolesID': '1',
      'Rolesname': 'Roles 1'
    }, {
      'RolesID': '2',
      'Rolesname': 'Roles 2'
    }, {
      'RolesID': '3',
      'Rolesname': 'Roles 3'
    }, {
      'RolesID': '4',
      'Rolesname': 'Roles 4'
    }, {
      'RolesID': '5',
      'Rolesname': 'Roles 5'
    }, {
      'RolesID': '6',
      'Rolesname': 'Roles 6'
    }, {
      'RolesID': '7',
      'Rolesname': 'Roles 7'
    }, {
      'RolesID': '8',
      'Rolesname': 'Roles 8'
    }, {
      'RolesID': '9',
      'Rolesname': 'Roles 9'
    }, {
      'RolesID': '10',
      'Rolesname': 'Roles 10'
    }, {
      'RolesID': '11',
      'Rolesname': 'Roles 11'
    }, {
      'RolesID': '12',
      'Rolesname': 'Roles 12'
    }, {
      'RolesID': '13',
      'Rolesname': 'Roles 13'
    }, {
      'RolesID': '14',
      'Rolesname': 'Roles 14'
    }, {
      'RolesID': '15',
      'Rolesname': 'Roles 15'
    }, {
      'RolesID': '16',
      'Rolesname': 'Roles 16'
    }, {
      'RolesID': '17',
      'Rolesname': 'Roles 17'
    }, {
      'RolesID': '18',
      'Rolesname': 'Roles 18'
    }, {
      'RolesID': '19',
      'Rolesname': 'Roles 19'
    }, {
      'RolesID': '20',
      'Rolesname': 'Roles 20'
    }, {
      'RolesID': '21',
      'Rolesname': 'Roles 21'
    }, {
      'RolesID': '22',
      'Rolesname': 'Roles 22'
    }, {
      'RolesID': '23',
      'Rolesname': 'Roles 23'
    }, {
      'RolesID': '24',
      'Rolesname': 'Roles 24'
    }, {
      'RolesID': '25',
      'Rolesname': 'Roles 25'
    }, {
      'RolesID': '26',
      'Rolesname': 'Roles 26'
    }, {
      'RolesID': '27',
      'Rolesname': 'Roles 27'
    }, {
      'RolesID': '28',
      'Rolesname': 'Roles 28'
    }, {
      'RolesID': '29',
      'Rolesname': 'Roles 29'
    }, {
      'RolesID': '30',
      'Rolesname': 'Roles 30'
    }, {
      'RolesID': '31',
      'Rolesname': 'Roles 31'
    }, {
      'RolesID': '32',
      'Rolesname': 'Roles 32'
    }, {
      'RolesID': '33',
      'Rolesname': 'Roles 33'
    }, {
      'RolesID': '34',
      'Rolesname': 'Roles 34'
    }, {
      'RolesID': '35',
      'Rolesname': 'Roles 35'
    }, {
      'RolesID': '36',
      'Rolesname': 'Roles 36'
    }, {
      'RolesID': '37',
      'Rolesname': 'Roles 37'
    }, {
      'RolesID': '38',
      'Rolesname': 'Roles 38'
    }, {
      'RolesID': '39',
      'Rolesname': 'Roles 39'
    }
  ]
  departmentlist: any = [];
  categorylist: any = [];
  positionlist: any = [];
  roleslist: any = [];
  loader:boolean = true;
  hSearchSettings() {
    console.log('Keyup', this.SearchDepartment.value);
    if (this.selectedTab == 'department') {
      this.GetDepartmentList({ num_row: 0, Search: this.SearchDepartment.value });
    }
    else if(this.selectedTab == 'category'){
      this.GetCategoryList({ num_row: 0, Search: this.SearchCategory.value });
    }
    else if(this.selectedTab == 'position'){
      this.GetPositionList({ num_row: 0, Search: this.SearchPosition.value });
    }
    else if(this.selectedTab == 'roles'){
      this.GetRolesList({ num_row: 0, Search: this.SearchRoles.value });
    }
  }

  async hDepartment(): Promise<Observable<any>> {
    this.loader = true;
    this.department = true;
    this.category = false;
    this.position = false;
    this.roles = false;
    this.useraccess = false;
    this.selectedTab = "department";
    // const dept = await this.authService.GetDepartmentList({num_row:0, Search:''});
    // this.departmentlist = dept;
    // console.log('hDepartment const dept', dept);
    //this.departmentlist = await this.authService.GetDepartmentList({ num_row: 0, Search: '' });
    this.departmentlist = await this.GetDepartmentList({ num_row: 0, Search: '' });
    console.log('hDepartment', this.departmentlist);
    return this.departmentlist;
  }
  hCategory = async () => {
    //if(!this.category) return;
    this.loader = true;
    this.department = false;
    this.category = true;
    this.position = false;
    this.roles = false;
    this.useraccess = false;
    this.selectedTab = "category";
    this.categorylist = this.GetCategoryList({ num_row: 0, Search: '' });
    //this.categorylist = await this.authService.GetCategoryList({ num_row: 0, Search: '' });
    //this.hCategoryList();
    //console.log('Category is not empty', this.categorylist.length);

    //this.categorylist = timeout(() => this.authService.GetCategoryList({num_row:0, Search:''}), 175);
  }
  hCategoryList(): Observable<any> {
    //this.categorylist = this.authService.GetCategoryList({ num_row: 0, Search: '' });
    this.categorylist = this.GetCategoryList({ num_row: 0, Search: '' });
    return this.categorylist;
  }
  hPosition() {
    this.loader = true;
    this.department = false;
    this.category = false;
    this.position = true;
    this.roles = false;
    this.useraccess = false;
    this.selectedTab = "position";
    this.categorylist = this.GetPositionList({ num_row: 0, Search: '' });
  }
  hRoles() {
    this.loader = true;
    this.department = false;
    this.category = false;
    this.position = false;
    this.roles = true;
    this.useraccess = false;
    this.selectedTab = "roles";
    this.roleslist = this.GetRolesList({ num_row: 0, Search: '' });
  }
  hUserAccess() {
    this.department = false;
    this.category = false;
    this.position = false;
    this.roles = false;
    this.useraccess = true;
    this.selectedTab = "useraccess";
  }

  hNewDepartment() {
    this.departmentDialogRef = this.dialog.open(NewDepartmentModalComponent, { data: { item: null, Title: 'Create Department', SaveButton: 'Create' } });
    this.departmentDialogRef.afterClosed().pipe(filter(name => name)).subscribe(name => {
      this.departmentlist.unshift(name);
    });
  }
  hNewCategory() {
    this.newcategoryDialogref = this.dialog.open(NewCategoryModalComponent, { data: { item: null, Title: 'Create Category' } });
    this.newcategoryDialogref.afterClosed().pipe(filter(name => name)).subscribe(name => {
      this.categorylist.unshift(name);
    })
  }

  hNewPosition() {
    this.newpositionDialogref = this.dialog.open(NewPositionModalComponent, { data: { item: null, Title: 'Create Position' } });
    this.newpositionDialogref.afterClosed().pipe(filter(name => name)).subscribe(name => {
      console.log('hNewPosition', name);
      this.positionlist.unshift(name);
    })
  }

  hNewRoles() {
    this.newrolesDialogref = this.dialog.open(NewRolesModalComponent, { data: { item: null, Title: 'Create Roles' } });
    this.newrolesDialogref.afterClosed().pipe(filter(name => name)).subscribe(name => {
      console.log('hNewRoles', name);
      this.roleslist.unshift(name);
    })
  }

  btnUpdate(item: any, idx: number) {
    this.departmentDialogRef = this.dialog.open(NewDepartmentModalComponent, { data: { item: item, Title: 'Update Department', SaveButton: 'Update' } });
    this.departmentDialogRef.afterClosed().pipe(filter(name => name)).subscribe(name => {
      console.log('btnUpdate', idx, name);
      this.departmentlist[idx] = name;
    })
  }

  btnUpdateCategory(item: any, idx: number) {
    this.newcategoryDialogref = this.dialog.open(NewCategoryModalComponent, { data: { item: item, Title: 'Update Category' } });
    this.newcategoryDialogref.afterClosed().pipe(filter(name => name)).subscribe(name => {
      console.log('btnUpdateCategory name', name);
      this.categorylist[idx] = name;
    })
  }

  btnUpdatePosition(item: any, idx: number) {
    this.newpositionDialogref = this.dialog.open(NewPositionModalComponent, { data: { item: item, Title: 'Update Position' } });
    this.newpositionDialogref.afterClosed().pipe(filter(name => name)).subscribe(name => {
      this.positionlist[idx] = name;
    })
  }

  btnUpdateRoles(item: any, idx: number) {
    this.newrolesDialogref = this.dialog.open(NewRolesModalComponent, { data: { item: item, Title: 'Update Roles' } });
    this.newrolesDialogref.afterClosed().pipe(filter(name => name)).subscribe(name => {
      this.roleslist[idx] = name;
    })
  }

  btnView(item: any) {
    console.log('Department View', item);
    this.departmentviewDialogRef = this.dialog.open(VIewDepartmentModalComponent, { data: { item } });
  }

  btnViewCategory(item: any) {
    this.viewcategoryDialogref = this.dialog.open(ViewCategoryModalComponent, { data: { item } });
  }
  btnViewPosition(item: any) {
    this.viewpositionDialogref = this.dialog.open(ViewPositionModalComponent, { data: { item } });
  }
  btnViewRoles(item: any) {
    this.viewrolesDialogref = this.dialog.open(ViewRolesModalComponent, { data: { item } });
  }
  GetDepartmentList(item: any): Observable<any[]> {
    rest.post('department/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.departmentlist = res.department;
        this.loader=false;
        //this.departmentlist;
      }
    });
    return this.departmentlist;
  }

  GetCategoryList(item: any): Observable<any> {

    rest.post('category/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.categorylist = res.category;
        console.log('GetCategoryList inside subscribe', this.categorylist);
        this.loader =false;
        return this.categorylist;
        //this.categorylist;
      }
    });
    console.log('GetCategoryList outside subscribe', this.categorylist);
    return this.categorylist;
  }
  GetPositionList(item: any): Observable<any> {

    rest.post('position/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.positionlist = res.position;
        //console.log('GetPositionList inside subscribe', this.positionlist);
        this.loader = false;
        return this.positionlist;
        //this.categorylist;
      }
    });
    console.log('GetPositionList outside subscribe', this.positionlist);
    return this.positionlist;
  }
  GetRolesList(item: any): Observable<any> {

    rest.post('roles/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.roleslist = res.roles;
        //console.log('GetPositionList inside subscribe', this.roles);
        this.loader = false;
        return this.roleslist;
        //this.categorylist;
      }
    });
    //console.log('GetPositionList outside subscribe', this.roleslist);
    return this.roleslist;
  }

}
