import { AuthData } from './../models/authData';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { environment } from '@env';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UserData } from '../models/userData';
import { SignupData } from '../models/signupData';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.baseUrl + 'login';
  private authStatusListener = new BehaviorSubject<boolean>(false);
  private isAuthenticated: boolean;
  private user: UserData;

  constructor(
    private http: HttpClient,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { }

  public getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  public getCookie() {
    return '';
  }

  public getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
}

  public login(authData: AuthData) {
    this.http.post(this.apiUrl + '/users', authData).subscribe((res: UserData) => {
    }, (err: any) => {
      this.matSnackBar.open('Try Again', 'OK', { duration: 1200});
    }, () => {
      this.matSnackBar.open('login Success', 'OK', { duration: 1000}).afterDismissed().subscribe(() => {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['dashboard'], { skipLocationChange: true });
      });
    });
  }

  public signup(data: SignupData) {
    return this.http.post(this.apiUrl + '/signup', { data });
  }

  public logout() {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['home'], { skipLocationChange: true });
  }

}
