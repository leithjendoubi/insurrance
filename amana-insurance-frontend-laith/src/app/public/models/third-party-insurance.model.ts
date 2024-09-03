import {Insurance} from "./insurance.model";


export class ThirdPartyInsurance extends Insurance{
    driver_name!:string
    driver_address!:string
    driver_phone!:number
    insurance_type!:string
    license_type!:string
    insurance_specifications!:string
    responsibility!:string
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
    insurance_value!:number
    endurance!:number
    taxe3!:number
}
