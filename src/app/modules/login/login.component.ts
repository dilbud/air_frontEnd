import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';

interface DialogData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  login: FormGroup;
  lock = true; // disable on destroy

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>,
    private matSnackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  ngOnInit(): void {
    this.login = this.formBuilder.group({
      Ctrl_1: ['', [Validators.required, Validators.email]],
      Ctrl_2: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnDestroy(): void {
    // disable on destroy
    if (this.lock) {
      this.dialogRef.close('close');
    }
  }

  // user login
  send() {
    if (this.login.valid) {
      this.lock = false;
      this.data.email = this.login.value.Ctrl_1;
      this.data.password = this.login.value.Ctrl_2;
      this.dialogRef.close(this.data);
    } else {
      this.lock = true;
      this.matSnackBar.open('Check email and password', 'OK', {
        duration: 1500,
      });
    }
  }

}
