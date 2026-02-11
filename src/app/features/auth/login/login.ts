import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputPhone, TuiTextarea } from '@taiga-ui/kit';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
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
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });
  authService = inject(Auth);
  router = inject(Router);

  submit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          // 3. Redirect here after successful login
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Login failed', err);
          // Show error message to user
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // Helper for HTML to access controls easily
  get f() {
    return this.loginForm.controls;
  }
}
