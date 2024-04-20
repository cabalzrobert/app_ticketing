import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../auth.service';
import { GeneralService } from '../../shared/services/general.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewusermodalComponent } from './newusermodal/newusermodal.component';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent {

  constructor(private authService: AuthService, public dialog: MatDialog, public generalSerive: GeneralService) { }
  logout() {
    this.authService.logout();
  }
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  NewUser() {
    this.dialog.open(NewusermodalComponent, {
      width:'fit-content',
      height:'fit-content'
    });
  }
}
