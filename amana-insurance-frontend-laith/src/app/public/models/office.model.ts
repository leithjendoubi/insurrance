import {User} from "./user.model";

export class Office{
  id!:number
  name!:string
  address!:string
  phone!:number
  gain_precentage_oblig!:number
  gain_precentage_travel!:number
  gain_precentage_third!:number
  gain_precentage_sante!:number
  totalDebts!:number
  createdAt!:Date
  updatedAt!:Date
  directorId!:number
  debtId!:number
  director!:User
}
