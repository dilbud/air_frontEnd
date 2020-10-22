import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {

  isAuth = false;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    this.isAuth = this.userService.getIsAuth();
    this.userService.getAuthStatusListener().subscribe((isAuth: boolean) => {
      this.isAuth = isAuth;
      if (!this.isAuth) {
        this.router.navigate(['home']);
      }
    });
    return this.isAuth;
  }
}
