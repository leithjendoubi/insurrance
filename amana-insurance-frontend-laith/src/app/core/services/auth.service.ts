import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {StorageService} from "./storage.service";
import {Observable} from "rxjs";
import {LoginUser} from "../../public/models/login-user.model";
import {LoginResponse} from "../../public/models/login-response.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private tokenStorageService:StorageService) { }

  prefix = 'auth';
  login(data:LoginUser) : Observable<LoginResponse>{
    return this.http.post(`${environment.baseUrl}/${this.prefix}/login`,data) as Observable<LoginResponse>;
  }


  refreshToken(){
    return this.http.get(`${environment.baseUrl}/${this.prefix}/refresh`)
  }
  logout() {
    return this.http.get(`${environment.baseUrl}/${this.prefix}/logout`)
  }
}
