import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

@Component({
  selector: 'app-department-head',
  templateUrl: './department-head.component.html',
  styleUrl: './department-head.component.scss'
})
export class DepartmentHeadComponent {
  sidenavTab = 'overview';

  constructor( private route: ActivatedRoute, private router: Router){}
  
  ngOnInit(){
    this.router.navigate(['head/dashboard','overview']);
  }

  onRouting(path: any){
    if(this.sidenavTab === path) return;
    this.sidenavTab = path;
    this.router.navigate(['head/dashboard',path]);
    // alert(this.route);
  }
}
