import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ObligatoryInsurance} from "../../public/models/obligatory-insurance.model";


@Injectable({
  providedIn: 'root'
})
export class ObligatoryInsuranceService {

  constructor(private http: HttpClient) {
  }

  prefix = 'assurance-obligatoire';

  createObligatoryInsurance(data: ObligatoryInsurance): Observable<ObligatoryInsurance> {
    return this.http.post(`${environment.baseUrl}/${this.prefix}/add`, data) as Observable<ObligatoryInsurance>;
  }

  getObligatoryInsurances():Observable<ObligatoryInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getall`) as Observable<ObligatoryInsurance[]>;
  }

  getObligatoryInsurancesByOffice(bureauiId:number):Observable<ObligatoryInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbybureau/${bureauiId}`) as Observable<ObligatoryInsurance[]>;
  }

  getObligatoryInsurancesByUser(useriId:number):Observable<ObligatoryInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbyuser/${useriId}`) as Observable<ObligatoryInsurance[]>;
  }

  getObligatoryInsuranceById(id: number): Observable<ObligatoryInsurance> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getone/${id}`) as Observable<ObligatoryInsurance>;
  }

  UpdateObligatoryInsurance(data: ObligatoryInsurance):Observable<ObligatoryInsurance> {
    return this.http.put(`${environment.baseUrl}/${this.prefix}/update/${data.id}`, data) as Observable<ObligatoryInsurance>;
  }

  DeleteObligatoryInsurance(id: number) {
    return this.http.delete(`${environment.baseUrl}/${this.prefix}/delete/${id}`)
  }

  SearchObligatoryInsurance(query:any):Observable<ObligatoryInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/search/${query}`) as Observable<ObligatoryInsurance[]>;
  }

  PDFObligatoryInsurance(id:number):Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/pdf/${id}`, { responseType: 'blob' }) as Observable<Blob>;
  }

  ReportObligatoryInsurance(body:any):Observable<ObligatoryInsurance[]> {
    return this.http.post(`${environment.baseUrl}/${this.prefix}/rapport`, body) as Observable<ObligatoryInsurance[]>;
  }
}
