import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {StorageService} from "../services/storage.service";

export const roleGuard: CanActivateFn = (route, state) => {
  return  route.data?.['role'].includes(inject(StorageService).getUser()?.role) ? true : inject(Router).navigate(['/dashboard/home'])
};
