import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import data from '../../../public/data'
import {MatButtonModule} from "@angular/material/button";
import {MatCustomButtonComponent} from "../../../public/components";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-choose-report',
  standalone: true,
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, MatCustomButtonComponent],
  templateUrl: './choose-report.component.html',
  styleUrl: './choose-report.component.scss'
})
export class ChooseReportComponent {
  constructor(private router:Router) {
  }

  insuranceTypes = data.global.insuranceTypes

  myForm = new FormGroup({
    insurance:new FormControl("",Validators.required)
  })

  onSubmit(){
    this.router.navigate(["/dashboard/reports/"+this.myForm.get('insurance')?.value])
  }

}
