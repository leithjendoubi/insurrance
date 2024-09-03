import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {User} from "../../public/models/user.model";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http :HttpClient) { }
  prefix = 'user';

  createUser(data: User): Observable<User>{
    return this.http.post(`${environment.baseUrl}/${this.prefix}/add`, data) as Observable<User>;
  }

  getUsers(): Observable<User[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getall`) as Observable<User[]>;
  }

    getUsersByOffice(id: number): Observable<User[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getallbybureau/${id}`) as Observable<User[]>;
  }

  getUserById(id: number):Observable<User>{
    return this.http.get(`${environment.baseUrl}/${this.prefix}/getone/${id}`) as Observable<User>;
  }

  UpdateUser(data: User):Observable<User> {
    return this.http.put(`${environment.baseUrl}/${this.prefix}/update/${data.id}`, data) as Observable<User>;
  }

  DeletUser(id: number) {
    return this.http.delete(`${environment.baseUrl}/${this.prefix}/delete/${id}`)
  }

  SearchUsers(query:any):Observable<User[]> {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/search/${query}`) as Observable<User[]>;
  }

  SearchUsersByOffice(query:any,bureauId:any):Observable<User[]> {
    return this.http.post(`${environment.baseUrl}/${this.prefix}/search-by-bureau/${query}`,bureauId)  as Observable<User[]>;
  }
}
