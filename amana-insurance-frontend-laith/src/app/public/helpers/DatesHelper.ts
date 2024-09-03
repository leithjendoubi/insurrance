import {Period} from "../shared/Period";
import data from "../data/obligatory-insurances.json";
import moment from "moment/moment";

export const DatesHelper = {
  getEndDate(period: number, startDate: Date) :Date{
    let endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + period)
    return endDate
  },

  getEndDateFromData(id: number,data:Period[], startDate: string):Date {
    let period  = data.find((row) => {
      return row.id === id
    })?.period
    let endDate = new Date(startDate)
    if(period!==undefined)
      endDate.setDate(endDate.getDate() + period)
    return endDate
  },

  getAge(birthDate: Date):number {
    const aujourdHui = new Date();
    const diffAnnees = aujourdHui.getFullYear() - birthDate.getFullYear();

    if (aujourdHui < new Date(aujourdHui.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
      return  diffAnnees - 1;
    } else {
      return  diffAnnees;
    }
  },

  getDatePlusYears(years:number):Date{
    let date = new Date()
    date.setFullYear(date.getFullYear()+years)
    return date
  },

  /*defineMomentLocale(){
    moment.defineLocale('ar-tn', {
      parentLocale: 'ar-tn',
      preparse: (string:string) => {
        return string;
      },
      postformat: (string:string) =>{
        return string;
      }
    });
  }*/
}
