import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {TravelInsurance} from "../../public/models/travel-insurance.model";
@Injectable({
  providedIn: 'root'
})
export class TravelInsuranceService {

  constructor(private http :HttpClient) { }
  prefix = 'travel';

  createTravelInsurance(data: TravelInsurance): Observable<TravelInsurance>{
    return this.http.post(`${environment.baseUrl}/${this.prefix}/add`, data) as Observable<TravelInsurance>;
  }

  getTravelInsurances(): Observable<TravelInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getall`).pipe() as Observable<TravelInsurance[]>;
  }

  getTravelInsurancesByOffice(bureauiId:number):Observable<TravelInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbybureau/${bureauiId}`) as Observable<TravelInsurance[]>;
  }

  getTravelInsurancesByUser(useriId:number):Observable<TravelInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbyuser/${useriId}`) as Observable<TravelInsurance[]>;
  }

  getTravelInsuranceById(id: number):Observable<TravelInsurance>{
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getone/${id}`) as Observable<TravelInsurance>;
  }

  UpdateTravelInsurance(data: TravelInsurance):Observable<TravelInsurance> {
    return this.http.put(`${environment.baseUrl}/${this.prefix}/update/${data.id}`, data) as Observable<TravelInsurance>;
  }

  DeleteTravelInsurance(id: number) {
    return this.http.delete(`${environment.baseUrl}/${this.prefix}/delete/${id}`)
  }

  SearchTravelInsurances(query:any):Observable<TravelInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/search/${query}`) as Observable<TravelInsurance[]>;
  }

  ReportTravelInsurance(body:any):Observable<TravelInsurance[]> {
    return this.http.post(`${environment.baseUrl}/${this.prefix}/rapport`, body) as Observable<TravelInsurance[]>;
  }

  PDFTravelInsurance(id:number):Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/pdf/${id}`, { responseType: 'blob' }) as Observable<Blob>;
  }
}
