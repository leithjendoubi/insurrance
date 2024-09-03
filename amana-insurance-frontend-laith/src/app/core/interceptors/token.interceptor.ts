import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {StorageService} from "../services/storage.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenStorageService:StorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const req=request.clone({
      withCredentials:true,
    })
    return next.handle(req);
  }
}
