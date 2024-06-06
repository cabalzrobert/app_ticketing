import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth.service';
import { GeneralService } from '../../shared/services/general.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewusermodalComponent } from './newusermodal/newusermodal.component';
import { Observable, filter } from 'rxjs';
import { rest } from '../../+services/services';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit {
  

  usersList1: any = [
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Head',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Sandeep Singh',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    },
    {
      ProfilePicture: 'assets/image/icon_blank_profile.png',
      Name: 'Prashant Kumar',
      EmailAddress: 'officialprasanttt@gail.com',
      Dapartment: 'Department',
      Role: 'Personnel',
      LastSeen: '24 Nov 2022, 4:45 PM'
    }
  ];
  usersList: any = [];
  constructor(private authService: AuthService, public dialog: MatDialog, public generalSerive: GeneralService) {

    this.Search = new FormControl();
  }
  Search: any = {};
  ngOnInit(): void {
    this.GetUserAccountList({ num_row: 0, Search: this.Search.value });
  }
  hSearchUsers() {
    this.GetUserAccountList({ num_row: 0, Search: this.Search.value });
  }

  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  NewUser() {
    /*
    this.dialog.open(NewusermodalComponent, {
      width: 'fit-content',
      height: 'fit-content'
    });
    */
    this.useraccountDialogRef = this.dialog.open(NewusermodalComponent, { data: { item: null, Title: 'Create User Account' } });
    this.useraccountDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => this.usersList.unshift(o));
  }
  useraccountDialogRef?: MatDialogRef<NewusermodalComponent>;
  hViewUuser(item: any, idx: number) {
    //console.log('hViewUser item', idx, item);
    this.useraccountDialogRef = this.dialog.open(NewusermodalComponent, { data: { item: item, Title: 'Update User Account' } });
    this.useraccountDialogRef.afterClosed().pipe(filter(o => o)).subscribe(o => {
      //this.usersList.unshift(o);
      this.usersList[idx] = o;
    });
  }


  GetUserAccountList(item: any): Observable<any> {

    rest.post('useraccount/list', item).subscribe(async (res: any) => {
      if (res.Status == 'ok') {
        this.usersList = res.useraccount;
        //console.log('GetPositionList inside subscribe', this.usersList);
        return this.usersList;
        //this.categorylist;
      }
    });
    //console.log('GetPositionList outside subscribe', this.usersList);
    return this.usersList;
  }

}
