import {Insurance} from "../models/insurance.model";
import {User} from "../models/user.model";
import {Office} from "../models/office.model";
import {Payment} from "../models/payment.model";
import {HealthInsurance} from "../models/health-insurance.model";

export type HealthInsuranceBottomSheetData = {
  management:'healthInsurance'
  url: string,
  isInsurance:boolean,
  tableRow : HealthInsurance,
  deleteObject: (healthInsurance: HealthInsurance)=>void
  printObject:(healthInsurance:HealthInsurance)=>void
}

export type PaymentBottomSheetData = {
  management:'payment'
  url: string,
  isInsurance:boolean,
  tableRow : Payment,
  delete:(id:number)=>void
  print:(id:number)=>void
  uploadBill:(payment:Payment)=>void
  acceptPayment:(id:number)=>void
  rejectPayment:(id:number)=>void
}

export type NormalBottomSheetData = {
  management:'normal'
  url: string,
  isInsurance:boolean,
  tableRow : Insurance | User | Office,
  delete:(id:number)=>void
  print:(id:number)=>void
}

export type BottomSheetData = HealthInsuranceBottomSheetData | PaymentBottomSheetData | NormalBottomSheetData
