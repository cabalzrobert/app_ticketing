import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingMainPageRoutingModule } from './setting-main-page-routing.module';
import { SettingscategoryComponent } from './settingscategory/settingscategory.component';
import { SettingsdepartmentComponent } from './settingsdepartment/settingsdepartment.component';
import { SettingspositionComponent } from './settingsposition/settingsposition.component';
import { NewDepartmentModalComponent } from './settingsdepartment/new-department-modal/new-department-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NewCategoryModalComponent } from './settingscategory/new-category-modal/new-category-modal.component';
import { NewPositionModalComponent } from './settingsposition/new-position-modal/new-position-modal.component';



@NgModule({
  declarations: [
    SettingscategoryComponent,
    SettingsdepartmentComponent,
    SettingspositionComponent,
    NewDepartmentModalComponent,
    NewCategoryModalComponent,
    NewPositionModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingMainPageRoutingModule
  ]
})
export class SettingMainPageModule { }
