import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Payment} from "../../public/models/payment.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http :HttpClient) { }
  prefix = 'payment';

  createPayment(fd: FormData): Observable<Payment>{
    return this.http.post(`${environment.baseUrl}/${this.prefix}/add`, fd) as Observable<Payment>;
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getall`).pipe() as Observable<Payment[]>;
  }

  GetPaymentFile(path:string):Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/${path}`, { responseType: 'blob' }) as Observable<Blob>;
  }

  getPaymentById(id: number):Observable<Payment>{
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getone/${id}`) as Observable<Payment>;
  }

  getPaymentsByOffice(id: number):Observable<Payment[]>{
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbybureau/${id}`) as Observable<Payment[]>;
  }

  UpdatePayment(data: Payment):Observable<Payment> {
    return this.http.put(`${environment.baseUrl}/${this.prefix}/update/${data.id}`, data) as Observable<Payment>;
  }

  DeletePayment(id: number) {
    return this.http.delete(`${environment.baseUrl}/${this.prefix}/delete/${id}`)
  }

  SearchPayments(query:any):Observable<Payment[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/search/${query}`) as Observable<Payment[]>;
  }

  acceptPayment(id: number):Observable<Payment> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/accept-payment/${id}`) as Observable<Payment>;
  }

  rejectPayment(id: number):Observable<Payment> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/reject-payment/${id}`) as Observable<Payment>;
  }
}
