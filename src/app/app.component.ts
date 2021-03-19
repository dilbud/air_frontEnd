import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from './data/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuth: boolean;
  subscription: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.isAuth = this.userService.getIsAuth();
    this.subscription = this.userService.getAuthStatusListener().subscribe((isAuth: boolean) => {
      this.isAuth = isAuth;
      if (!this.isAuth) {
        this.router.navigate(['home'], {skipLocationChange: true});
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
