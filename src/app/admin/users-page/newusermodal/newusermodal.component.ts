import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../../shared/services/general.service';

@Component({
  selector: 'app-newusermodal',
  templateUrl: './newusermodal.component.html',
  styleUrl: './newusermodal.component.scss'
})
export class NewusermodalComponent implements OnInit {
  today:Date | undefined;
  constructor(public generalSerive: GeneralService) { }
  ngOnInit(): void {
    this.today = new Date();
  }
}
