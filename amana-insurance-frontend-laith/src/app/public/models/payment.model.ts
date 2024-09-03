type Bill = {
  id:number,
  type:string,
  title:string,
  path:string,
  createdAt:Date,
  updatedAt:Date,
}

export class Payment {
  id!:number
  state!:number
  amount!:number
  createdAt!:Date
  updatedAt!:Date
  bureauId!:number
  paymentBillId!:number
  bill!:Bill
}
