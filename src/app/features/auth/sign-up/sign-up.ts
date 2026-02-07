import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';
@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, ReactiveFormsModule, TuiTextarea, TuiTextfield],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  host: {
    class: 'pt-8 block',
  },
})
export class SignUp {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  submit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
