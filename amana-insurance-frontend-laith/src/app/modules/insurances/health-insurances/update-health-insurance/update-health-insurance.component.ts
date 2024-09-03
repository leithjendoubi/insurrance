import { Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HealthInsurance} from "../../../../public/models/health-insurance.model";


@Component({
  selector: 'app-update-health-insurance',
  templateUrl: './update-health-insurance.component.html',
  styleUrls: ['./update-health-insurance.component.scss']
})
export class UpdateHealthInsuranceComponent {
  type:string= (history.state.data as HealthInsurance).type

  ngOnInit(): void {
  }

  onSelectionChanged(type: string){
    this.type=type
  }

  constructor() {
  }
}
