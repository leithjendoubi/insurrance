import {Insurance} from "../models/insurance.model";
import {Column} from "../shared/column";
import {Payment} from "../models/payment.model";

export const TablesHelper = {
  sortTable(table:Insurance[]){
    table.sort((a,b)=> {
      if(a.createdAt > b.createdAt)
        return -1
      else if (a.createdAt < b.createdAt)
        return 1
      else
        return 0
    });
  },

  sortPaymentTable(table:Payment[]){
    table.sort((a,b)=> {
      if(a.state === b.state)
        return 0
      else if(a.state===0)
        return -1
      else if (b.state===0)
        return 1
      else if(a.state===-1)
        return 1
      else
        return -1

    })
  },

  filterTable(table:Insurance[],searchKey:string){
    return table.filter((insurance:Insurance)=>{
      return insurance.name.toLowerCase().includes(searchKey.toLowerCase())
    })
  },

  calculateSum(table:Insurance[]) : number{
    return table.reduce((sum,insurance)=>sum+insurance.total,0)
  }

}
