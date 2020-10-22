import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../data/services/user.service';
import { SignupData } from 'src/app/data/models/signupData';

export interface Temp {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  formName: FormGroup;
  formEmail: FormGroup;
  formPassword: FormGroup;
  formUserCat: FormGroup;
  formPoliceStation: FormGroup;
  formPostOffice: FormGroup;
  formNIC: FormGroup;
  formOfficerID: FormGroup;

  private user: any = null;

  public userCat: string;

  fields: Temp[] = [
    { value: 'cop', viewValue: 'police station' },
    { value: 'post', viewValue: 'post office' },
    // { value: license, viewValue: 'license office' },
  ];

  policeStationList: Temp[] = [
    { value: 'Pettah', viewValue: 'Pettah' },
    { value: 'Maradana', viewValue: 'Maradana' },
    { value: 'Fort', viewValue: 'Fort' },
  ];

  postOfficeList: Temp[] = [
    { value: '10120', viewValue: 'Battaramulla' },
    { value: '10230', viewValue: 'Pannipitiya' },
    { value: '10250', viewValue: 'Nugegoda' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public userService: UserService
  ) { }
  /**
   * init ,get user details and set form validation and
   */
  ngOnInit() {
    this.formName = this.formBuilder.group({
      Ctrl_1: ['', [Validators.required]],
      Ctrl_2: ['', [Validators.required]],
    });

    this.formEmail = this.formBuilder.group({
      Ctrl_1: [
        { value: '', disabled: false },
        [Validators.required, Validators.email],
      ],
    });
    this.formPassword = this.formBuilder.group({
      Ctrl_1: ['', [Validators.required, Validators.minLength(1)]],
    });
    this.formNIC = this.formBuilder.group({
      Ctrl_1: ['', [Validators.required]],
    });
    this.formUserCat = this.formBuilder.group({
      Ctrl_1: ['', [Validators.required]],
    });
    this.formOfficerID = this.formBuilder.group({
      Ctrl_1: [
        {
          value: '',
          disabled: false,
        },
        [Validators.required],
      ],
    });
    this.formPoliceStation = this.formBuilder.group({
      Ctrl_1: [
        {
          value: '',
          disabled: false,
        },
        [Validators.required],
      ],
    });
    this.formPostOffice = this.formBuilder.group({
      Ctrl_1: [
        {
          value: '',
          disabled: false,
        },
        [Validators.required],
      ],
    });
    this.onChange();
  }
  /**
   * form validation pro and gen
   */
  onChange() {
    this.formUserCat.get('Ctrl_1').valueChanges.subscribe((val) => {
      this.userCat = val;
      console.log('this is value', val);
    });
  }
  /**
   * validation and send data
   */
  public submit() {
    if (
      (this.formName.valid &&
        this.formEmail.valid &&
        this.formPassword.valid)
    ) {
      const firstName = this.formName.value.Ctrl_1;
      const lastName = this.formName.value.Ctrl_2;
      const email = this.formEmail.value.Ctrl_1;
      const password = this.formPassword.value.Ctrl_1;
      const nic = this.formNIC.value.Ctrl_1;
      const userType = this.formUserCat.value.Ctrl_1;

      const policeStation = this.formPoliceStation.value.Ctrl_1;
      const copId = this.formOfficerID.value.Ctrl_1;

      const postOffice = this.formPostOffice.value.Ctrl_1;

      this.userService.signup({
        email,
        password
      });
    } else {
      alert('submission fail');
    }
  }
}
