import {HealthInsurance} from "./health-insurance.model";

export class PersonHealthInsurance extends HealthInsurance{
  numero_passport!:string
  birthDate!:Date
  job!:string
  sex!:string
  nationalite!:string
  taxe3!:number
}
