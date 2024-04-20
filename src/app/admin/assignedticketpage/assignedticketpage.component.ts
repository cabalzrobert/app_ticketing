import { Component } from '@angular/core';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-assignedticketpage',
  templateUrl: './assignedticketpage.component.html',
  styleUrl: './assignedticketpage.component.scss'
})
export class AssignedticketpageComponent {
  hChangePassword() {
    this.overview = false;
    this.profileedit = false;
    this.profilesettings = false;
    this.profilechangepassword = true;
    console.log('Change Password', this.hChangePassword);
  }
  hSettings() {
    this.overview = false;
    this.profileedit = false;
    this.profilesettings = true;
    this.profilechangepassword = false;
    console.log('Settings', this.profilesettings);
  }
  hoverview() {
    this.overview = true;
    this.profileedit = false;
    this.profilesettings = false;
    this.profilechangepassword = false;
    console.log('Overview', this.overview);
  }
  hEditProfile() {
    this.overview = false;
    this.profileedit = true;
    this.profilesettings = false;
    this.profilechangepassword = false;
    console.log('Edit Profile', this.profileedit);

  }
  overview: boolean = false
  profileedit: boolean = false;
  profilesettings: boolean = false;
  profilechangepassword: boolean = false;
}
