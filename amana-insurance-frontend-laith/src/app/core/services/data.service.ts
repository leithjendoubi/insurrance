import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {OfficeService} from "./office.service";
import {User} from "../../public/models/user.model";
import {UserService} from "./user.service";
import {StorageService} from "./storage.service";
import {Office} from "../../public/models/office.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {


  private _offices:Office[]=[]
  private _allUsers:User[]=[]
  private _officeUsers:User[]=[]
  private _selectedOfficeUsers:User[]=[]
  private _countries:string[]=[]
  private _countries_in_English:string[]=[]
  private _isAdmin!: boolean
  private _isUser!: boolean
  private _isDirector!: boolean
  private _isFinance!: boolean

  constructor(private officeService:OfficeService, private userService:UserService, private tokenStorageService:StorageService, private http:HttpClient) { }

  public get offices():Office[]{
    return this._offices
  }
  public set offices(value:Office[]){
    value.map((office:Office)=>{this._offices.push(office)})
  }
  get allUsers(): User[] {
    return this._allUsers;
  }

  set allUsers(value: User[]) {
    value.map((user:User)=>{this._allUsers.push(user)})
  }

  get officeUsers(): User[] {
    return this._officeUsers;
  }

  set officeUsers(value: User[]) {
    value.map((user:User)=>{this._officeUsers.push(user)})
  }

  get selectedOfficeUsers(): User[] {
    return this._selectedOfficeUsers;
  }

  set selectedOfficeUsers(value: User[]) {
    value.map((user:User)=>{this._selectedOfficeUsers.push(user)})
  }

  get countries(): string[] {
    return this._countries;
  }

  set countries(value: string[]) {
    value.map((pays:string)=>{this._countries_in_English.push(pays)})
  }

  get countriesInEnglish(): string[] {
    return this._countries;
  }

  set countriesInEnglish(value: string[]) {
    value.map((pays:string)=>{this._countries_in_English.push(pays)})
  }



  fetchOffices()  {
    this.officeService.getOffices().subscribe((res:Office[])=> {
      this.offices.length=0
      this.offices=res
    })
  }

  fetchCountries()  {
    this.http.get('https://restcountries.com/v3.1/all?lang=ar').subscribe({
          next: (data: any) => {
            this.countries.length=0
            data.forEach((country:any)=>{this.countries.push(country.translations.ara.common)})
            this.countries.sort((a,b)=>a.localeCompare(b))
          }
        }
    )
  }

  fetchCountriesInEnglish()  {
    this.http.get('https://restcountries.com/v3.1/all').subscribe({
        next: (data: any) => {
          this.countriesInEnglish.length=0
          data.forEach((country:any)=>{this.countriesInEnglish.push(country.name.common)})
          this.countriesInEnglish.sort((a,b)=>a.localeCompare(b))
        }
      }
    )
  }

  fetchAllUsers()  {
    this.userService.getUsers().subscribe((res:User[])=> {
      this.allUsers.length=0
      this.allUsers=res
    })
  }

  fetchUsersByOffice()  {
    this.userService.getUsersByOffice(this.tokenStorageService.getUser().bureauId).subscribe((res:User[])=> {
      this.officeUsers.length=0
      this.officeUsers=res
    })
  }

  fetchUsersBySelectedOffice(id:number)  {

    this.userService.getUsersByOffice(id).subscribe((res:User[])=> {
      this.selectedOfficeUsers.length=0
      this.selectedOfficeUsers=res
    })
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  set isAdmin(access: boolean) {
    this._isAdmin = access
  }

  get isDirector(): boolean {
    return this._isDirector;
  }

  set isDirector(access: boolean) {
    this._isDirector = access
  }

  get isUser(): boolean {
    return this._isUser;
  }

  set isUser(access: boolean) {
    this._isUser = access
  }

  get isFinance(): boolean {
    return this._isFinance;
  }

  set isFinance(access: boolean) {
    this._isFinance = access
  }



}
