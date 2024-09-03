import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {GroupHealthInsurance} from "../../public/models/group-health-insurance.model";


@Injectable({
  providedIn: 'root'
})
export class GroupHealthInsuranceService {

  constructor(private http :HttpClient) { }
  prefix = 'sante-groupe';

  createGroupHealthInsurance(data: GroupHealthInsurance): Observable<GroupHealthInsurance>{
    return this.http.post(`${environment.baseUrl}/${this.prefix}/add`, data) as Observable<GroupHealthInsurance>;
  }

  getGroupHealthInsurances(): Observable<GroupHealthInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getall`).pipe() as Observable<GroupHealthInsurance[]>;
  }

  getGroupHealthInsurancesByOffice(bureauiId:number):Observable<GroupHealthInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbybureau/${bureauiId}`) as Observable<GroupHealthInsurance[]>;
  }

  getGroupHealthInsurancesByUser(useriId:number):Observable<GroupHealthInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbyuser/${useriId}`) as Observable<GroupHealthInsurance[]>;
  }

  getGroupHealthInsuranceById(id: number):Observable<GroupHealthInsurance>{
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getone/${id}`) as Observable<GroupHealthInsurance>;
  }

  UpdateGroupHealthInsurance(data: GroupHealthInsurance):Observable<GroupHealthInsurance> {
    return this.http.put(`${environment.baseUrl}/${this.prefix}/update/${data.id}`, data) as Observable<GroupHealthInsurance>;
  }

  DeleteGroupHealthInsurance(id: number) {
    return this.http.delete(`${environment.baseUrl}/${this.prefix}/delete/${id}`)
  }

  SearchGroupHealthInsurance(query:any):Observable<GroupHealthInsurance[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/search/${query}`) as Observable<GroupHealthInsurance[]>;
  }

  ReportGroupHealthInsurance(body:any):Observable<GroupHealthInsurance[]> {
    return this.http.post(`${environment.baseUrl}/${this.prefix}/rapport`, body) as Observable<GroupHealthInsurance[]>;
  }

  PDFGroupHealthInsurance(id:number):Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/pdf/${id}`, { responseType: 'blob' }) as Observable<Blob>;
  }
}
