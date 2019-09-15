import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, AbstractControl } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import * as sha1 from 'sha1';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  signupform: FormGroup;
  submitedData: JSON;
  pwdFlag = false;
  genErrorMsg = 'This Password is previously been exposed in data breaches';
  jsonFlag = false;

  constructor(private formBuilder: FormBuilder, private shared: SharedService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.signupform = this.formBuilder.group({
      'email': [null, [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      'password': [null, [Validators.required, Validators.minLength(6)]],
      'ccNumber': [null, [Validators.required, Validators.pattern(/^\d{16}$/)]],
      'ccName': [null, [Validators.required]],
      'ccExp': [null, [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/(19|2[0-1])\d{2}$/)]],
      'ccSecurityCode': [null, [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
  }

  onSubmit(data) {
    this.submitedData = data;
    this.jsonFlag = true;
  }
  clearForm() {
    this.signupform.reset();
    let control: AbstractControl = null;
    this.signupform.markAsUntouched();
    Object.keys(this.signupform.controls).forEach((name) => {
      control = this.signupform.controls[name];
      control.setErrors(null);
    });
    this.signupform.setErrors({ 'invalid': true });
  }

  onBlur(control) {
    const psString = control.value;
    if (!psString) {
      return;
    }
    const psHash = sha1(psString);
    const psFive = psHash.slice(0, 5);
    let psMatch: string = psHash.slice(5, 40);
    psMatch = psMatch.toUpperCase();
    this.shared.passwordValidation(psFive).subscribe((res: string) => {
      this.pwdFlag = res.includes(psMatch);
    });
  }
  getErrorMessages(ele) {
    switch (ele) {
      case 'email': return this.signupform.get('email').hasError('required') ? 'Field is required.' : 'Not a valid Email.';
      case 'password': return this.signupform.get('password').hasError('required') ? 'Field is required.' : 'Minimum 6 character required.';
      case 'ccNumber': return this.signupform.get('ccNumber').hasError('required') ? 'Field is required.' : 'Not a valid Pattern.';
      case 'ccName': return 'Field is required.';
      case 'ccExp': return this.signupform.get('ccExp').hasError('required') ? 'Field is required.' : 'Not a valid Pattern.';
      case 'ccSecurityCode': return this.signupform.get('ccSecurityCode').hasError('required') ? 'Field is required.' : 'Not a valid Pattern.';
    }
  }
}
