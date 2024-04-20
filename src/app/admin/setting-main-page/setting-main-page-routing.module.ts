import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingMainPageComponent } from './setting-main-page.component';
import { SettingscategoryComponent } from './settingscategory/settingscategory.component';
import { SettingsdepartmentComponent } from './settingsdepartment/settingsdepartment.component';
import { SettingspositionComponent } from './settingsposition/settingsposition.component';

const routes: Routes = [
  {path:'',component:SettingMainPageComponent,children:[
    {path:'',component:SettingsdepartmentComponent},
    {path:'category',component:SettingscategoryComponent},
    {path:'department',component:SettingsdepartmentComponent},
    {path:'position',component:SettingspositionComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingMainPageRoutingModule { }
