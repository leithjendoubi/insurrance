import {Insurance} from "./insurance.model";


export class TravelInsurance extends Insurance{
  zone_couver!:string
  periode!:string
  nationalite!:string
  sex!:string
  numero_passport!:string
  methode_paiement!:string
  taxe3!:number
  direction!:string
  birthDate!:Date
}
