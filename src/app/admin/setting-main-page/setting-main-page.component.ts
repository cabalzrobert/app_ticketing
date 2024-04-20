import { Component } from '@angular/core';
import { GeneralService } from '../../shared/services/general.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { menusettingsbarData } from './menusettingsbarData';

@Component({
  selector: 'app-setting-main-page',
  templateUrl: './setting-main-page.component.html',
  styleUrl: './setting-main-page.component.scss'
})
export class SettingMainPageComponent {

  menuData = menusettingsbarData;
  constructor(public dialog:MatDialog, public generalSerive: GeneralService){}
  openpopnewticket(){
    this.generalSerive.showDialog = false;
   
  }
}
