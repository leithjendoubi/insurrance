import {Insurance} from "./insurance.model";

export class ObligatoryInsurance extends Insurance{
  insurance_type!:string
  license_type!:string
  assurance_specifications!:string
  type_car!:string
  numero_serie!:string
  numero_structure!:string
  numero_moteur!:string
  Charge!:number
  nb_passager!:number
  annee_de_fabrication!:number
  couleur!:string
  Pays_de_fabrication!:string
  Orga_de_delivr!:string
  taxe3!:number
}
