import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TUI_IS_IOS } from '@taiga-ui/cdk';
import { TuiButton, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiInputPhone, TuiTextarea } from '@taiga-ui/kit';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextarea,
    TuiTextfield,
    FormsModule,
    TuiInputPhone,
    TuiButton,
    TuiIcon,
    RouterLink,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  host: {
    class: 'pt-16 block',
  },
})
export class SignUp {
  registerForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      // Add phone control here with default +98
      phone: new FormControl('', [Validators.required, Validators.minLength(12)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConfirm: new FormControl('', [Validators.required]),
    },
    { validators: this.matchPasswords },
  );
  authService = inject(Auth);
  isLoading = signal(false);
  router = inject(Router);

  protected readonly isIos = inject(TUI_IS_IOS);

  // Change default value to Iran code
  public value = '+98';

  protected get pattern(): string | null {
    // IOS pattern: allows +98 and spaces/dashes
    return this.isIos ? '+98[- ]?[0-9-]{1,20}' : null;
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);

    this.authService
      .signUp(this.registerForm.value)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          // Success: Redirect to Profile (or Home)
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Signup failed', err);
          // Handle error (e.g., "Email already exists")
        },
      });
  }

  // Custom Validator Function
  matchPasswords(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('passwordConfirm')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  // Helper for HTML to access controls easily
  get f() {
    return this.registerForm.controls;
  }
}
