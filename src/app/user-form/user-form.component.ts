import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../aservices/auth.service';
import {CurrencyComponent} from '../currency/currency.component';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifyService} from '../aservices/notify.service';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  
  userForm: FormGroup;
  newUser = false; // to toggle login or signup form
  passReset = false; // set to true when password reset is triggered
  formErrors: FormErrors = {
    'email': '',
    'password': '',
  };
  validationMessages = { 
    'email': {
      'required': 'Email must be a valid email.',
      'email': 'Email must be a valid email.',
    },
    'password': {
      'required': 'Please make it at least 4 symbols long.',
      'pattern': 'Please include one letter and one number.',
      'minlength': 'Please make it at least 4 symbols long.',
      'maxlength': "Can't more than 40 symbols long.",
    },
  };



  constructor(private fb: FormBuilder, 
    private auth: AuthService,
    public activeModal: NgbActiveModal,
    public notifyService: NotifyService) { }

  ngOnInit() {
    this.buildForm();
  }

  toggleForm() {
    this.newUser = !this.newUser;
  } 

  signup() {
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'])
    .then(() => {
      if(this.notifyService.style == 'error'){
        return false
      }else{
        this.activeModal.close()
      }
    }
    );
  }

  login() {
    this.auth.emailLogin(this.userForm.value['email'], this.userForm.value['password'])
    .then(() => {
      if(this.notifyService.style == 'error'){
        return false
      }else{
        this.activeModal.close()
      }
    }
    );
  }

  resetPassword() {
    this.auth.resetPassword(this.userForm.value['email'])
      .then(() => this.passReset = true);
  }

  buildForm() {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email,
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
      ]],
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'email' || field === 'password')) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key) ) {
                this.formErrors[field] += `${(messages as {[key: string]: string})[key]} `;
              }
            }
          }
        }
      }
    }
  }
}
