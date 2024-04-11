import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-ticket-page',
  templateUrl: './ticket-page.component.html',
  styleUrl: './ticket-page.component.scss'
})
export class TicketPageComponent {
  constructor(private authService: AuthService) { }
  logout() {
    this.authService.logout();
  }
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);
}
