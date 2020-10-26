import { UserData } from './../../data/models/userData';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/data/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { LoginComponent } from 'src/app/modules/login/login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  email: string;
  password: string;
  name: string;
  isAuthenticated = false;
  user = null;
  toggle = true; // disable login link

  public isAuth = false;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.isAuth = this.userService.getIsAuth();
    this.userService.getAuthStatusListener().subscribe((isAuth: boolean) => {
      this.isAuth = isAuth;
    });
  }

  loginDialog(): void {
    this.toggle = false;
    const dialogRef = this.dialog.open(LoginComponent, {
      width: 'auto',
      height: 'auto',
      data: { email: this.email, password: this.password }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close' && result !== null) {
        console.log(result);
        this.toggle = true;
        this.userService.login(result);
      } else {
        this.toggle = true;
      }
    });
  }

  // navigate to home
  public navHome() {
    this.router.navigate(['home'], { skipLocationChange: true });
  }
  // logout user
  public logout() {
    this.userService.logout();
  }
  // go to dashboard
    public dashboard() {
      this.router.navigate(['dashboard'], { skipLocationChange: true });
    }
  // go to profile
  public profile() {
    this.router.navigate(['profile'], { skipLocationChange: true });
  }

}
