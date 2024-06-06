import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-communicator',
  templateUrl: './communicator.component.html',
  styleUrl: './communicator.component.scss'
})
export class CommunicatorComponent {
  sidenavTab = 'overview';

  constructor( private route: ActivatedRoute, private router: Router){}
  
  ngOnInit(){
    this.router.navigate(['communicator/dashboard','overview']);
  }

  onRouting(path: any){
    if(this.sidenavTab === path) return;
    this.sidenavTab = path;
    this.router.navigate(['communicator/dashboard',path]);
    // alert(this.route);
  }
}
