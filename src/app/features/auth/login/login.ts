import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputPhone, TuiTextarea } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, TuiTextfield, FormsModule, TuiButton, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  host: {
    class: 'pt-16 block',
  },
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  submit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // Helper for HTML to access controls easily
  get f() {
    return this.loginForm.controls;
  }
}
