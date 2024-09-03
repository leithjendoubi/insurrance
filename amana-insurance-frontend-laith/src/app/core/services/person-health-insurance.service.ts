import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {PersonHealthInsurance} from "../../public/models/person-health-insurance.model";


@Injectable({
  providedIn: 'root'
})
export class PersonHealthInsuranceService {

  constructor(private http :HttpClient) { }
  prefix = 'sante-personne';

  createPersonHealthInsurance(data: PersonHealthInsurance): Observable<PersonHealthInsurance>{
    return this.http.post(`${environment.baseUrl}/${this.prefix}/add`, data) as Observable<PersonHealthInsurance>;
  }

  getPersonHealthInsurances(): Observable<PersonHealthInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getall`).pipe() as Observable<PersonHealthInsurance[]>;
  }

  getPersonHealthInsurancesByOffice(bureauiId:number):Observable<PersonHealthInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbybureau/${bureauiId}`) as Observable<PersonHealthInsurance[]>;
  }

  getPersonHealthInsurancesByUser(useriId:number):Observable<PersonHealthInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbyuser/${useriId}`) as Observable<PersonHealthInsurance[]>;
  }

  getPersonHealthInsuranceById(id: number):Observable<PersonHealthInsurance>{
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getone/${id}`) as Observable<PersonHealthInsurance>;
  }

  UpdatePersonHealthInsurance(data: PersonHealthInsurance):Observable<PersonHealthInsurance> {
    return this.http.put(`${environment.baseUrl}/${this.prefix}/update/${data.id}`, data) as Observable<PersonHealthInsurance>;
  }

  DeletePersonHealthInsurance(id: number) {
    return this.http.delete(`${environment.baseUrl}/${this.prefix}/delete/${id}`)
  }

  SearchPersonHealthInsurances(query:any):Observable<PersonHealthInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/search/${query}`) as Observable<PersonHealthInsurance[]>;
  }

  ReportPersonHealthInsurance(body:any):Observable<PersonHealthInsurance[]> {
    return this.http.post(`${environment.baseUrl}/${this.prefix}/rapport`, body) as Observable<PersonHealthInsurance[]>;
  }

  PDFPersonHealthInsurance(id:number):Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/pdf/${id}`, { responseType: 'blob' }) as Observable<Blob>;
  }
}
