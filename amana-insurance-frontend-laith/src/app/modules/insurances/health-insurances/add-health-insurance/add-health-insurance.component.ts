import { Component } from '@angular/core';


@Component({
  selector: 'app-add-health-insurance',
  templateUrl: './add-health-insurance.component.html',
  styleUrls: ['./add-health-insurance.component.scss']
})
export class AddHealthInsuranceComponent {
  type:string='صحي فرد'

  ngOnInit(): void {
  }

  onSelectionChanged(type: string){
    this.type=type
  }

  constructor() {
  }
}
