import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { RouterLink } from '@angular/router';
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
      email: new FormControl('', [Validators.required, Validators.email]),
      // Add phone control here with default +98
      phone: new FormControl('', [Validators.required, Validators.minLength(12)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.matchPasswords },
  );

  protected readonly isIos = inject(TUI_IS_IOS);

  // Change default value to Iran code
  public value = '+98';

  protected get pattern(): string | null {
    // IOS pattern: allows +98 and spaces/dashes
    return this.isIos ? '+98[- ]?[0-9-]{1,20}' : null;
  }

  submit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  // Custom Validator Function
  matchPasswords(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  // Helper for HTML to access controls easily
  get f() {
    return this.registerForm.controls;
  }
}
