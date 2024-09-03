import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ThirdPartyInsurance} from "../../public/models/third-party-insurance.model";


@Injectable({
  providedIn: 'root'
})
export class ThirdPartyInsuranceService {

  constructor(private http :HttpClient) { }
  prefix = 'third-insurance';

  createThirdPartyInsurance(data: ThirdPartyInsurance): Observable<ThirdPartyInsurance>{
    return this.http.post(`${environment.baseUrl}/${this.prefix}/add`, data) as Observable<ThirdPartyInsurance>;
  }

  getThirdPartyInsurances(): Observable<ThirdPartyInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getall`).pipe() as Observable<ThirdPartyInsurance[]>;
  }

  getThirdPartyInsurancesByOffice(bureauiId:number):Observable<ThirdPartyInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbybureau/${bureauiId}`) as Observable<ThirdPartyInsurance[]>;
  }

  getThirdPartyInsurancesByUser(useriId:number):Observable<ThirdPartyInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbyuser/${useriId}`) as Observable<ThirdPartyInsurance[]>;
  }

  getThirdPartyInsuranceById(id: number):Observable<ThirdPartyInsurance>{
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getone/${id}`) as Observable<ThirdPartyInsurance>;
  }

  UpdateThirdPartyInsurance(data: ThirdPartyInsurance):Observable<ThirdPartyInsurance> {
    return this.http.put(`${environment.baseUrl}/${this.prefix}/update/${data.id}`, data) as Observable<ThirdPartyInsurance>;
  }

  DeleteThirdPartyInsurance(id: number) {
    return this.http.delete(`${environment.baseUrl}/${this.prefix}/delete/${id}`)
  }

  SearchThirdPartyInsurances(query:any):Observable<ThirdPartyInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/search/${query}`) as Observable<ThirdPartyInsurance[]>;
  }

  ReportThirdPartyInsurance(body:any):Observable<ThirdPartyInsurance[]> {
    return this.http.post(`${environment.baseUrl}/${this.prefix}/rapport`, body) as Observable<ThirdPartyInsurance[]>;
  }

  PDFThirdPartyInsurance(id:number):Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/pdf/${id}`, { responseType: 'blob' }) as Observable<Blob>;
  }
}
