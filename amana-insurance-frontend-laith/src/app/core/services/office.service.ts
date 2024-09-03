import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Office} from "../../public/models/office.model";

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  constructor(private http :HttpClient) { }
  prefix = 'bureau';

  createOffice(data: any): Observable<any>{
    return this.http.post(`${environment.baseUrl}/${this.prefix}/add`, data) as Observable<any>;
  }

  getOffices(): Observable<Office[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getall`) as Observable<Office[]>;
  }

  getOfficeById(id: number):Observable<Office>{
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getone/${id}`) as Observable<Office>;
  }

  UpdateOffice(data: Office):Observable<Office> {
    return this.http.put(`${environment.baseUrl}/${this.prefix}/update/${data.id}`, data) as Observable<Office>;
  }

  DeletOffice(id: number) {
    return this.http.delete(`${environment.baseUrl}/${this.prefix}/delete/${id}`)
  }

  SearchOffices(query:any):Observable<Office[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/search/${query}`) as Observable<Office[]>;
  }
}
