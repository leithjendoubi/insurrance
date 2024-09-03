import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {StorageService} from "../services/storage.service";

export const authGuard: CanActivateFn = (route, state) => {
   return (inject(StorageService).isLoggedIn()) ? true : inject(Router).navigate(['/login'])
};

export const loginGuard:CanActivateFn = (route,state) => {
  return (!inject(StorageService).isLoggedIn()) ? true : inject(Router).navigate(['/dashboard/home'])
}
