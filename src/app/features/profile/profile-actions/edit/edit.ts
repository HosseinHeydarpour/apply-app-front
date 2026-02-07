import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TUI_IS_IOS, TuiAutoFocus } from '@taiga-ui/cdk';
import { TuiButton, TuiDialog, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiFileLike, TuiFiles, TuiInputPhone, TuiTextarea } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { Subject, switchMap, Observable, of, timer, map, finalize } from 'rxjs';
@Component({
  selector: 'app-edit',
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
    TuiAutoFocus,
    TuiDialog,
    TuiHint,
    AsyncPipe,
    TuiFiles,
  ],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
  host: {
    class: 'pt-16 block',
  },
})
export class Edit {
  editForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      // Add phone control here with default +98
      phone: new FormControl('', [Validators.required, Validators.minLength(12)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.matchPasswords },
  );

  protected open = false;

  protected readonly isIos = inject(TUI_IS_IOS);

  // Change default value to Iran code
  public value = '+98';

  protected get pattern(): string | null {
    // IOS pattern: allows +98 and spaces/dashes
    return this.isIos ? '+98[- ]?[0-9-]{1,20}' : null;
  }

  submit() {
    if (this.editForm.valid) {
      console.log(this.editForm.value);
    } else {
      this.editForm.markAllAsTouched();
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
    return this.editForm.controls;
  }

  showDialog() {
    this.open = true;
  }

  closeDialog() {
    this.open = false;
    this.removeFile();
  }

  protected readonly control = new FormControl<TuiFileLike | null>(null, Validators.required);

  protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap((file) => this.processFile(file)),
  );

  protected removeFile(): void {
    this.control.setValue(null);
  }

  protected processFile(file: TuiFileLike | null): Observable<TuiFileLike | null> {
    this.failedFiles$.next(null);

    if (this.control.invalid || !file) {
      return of(null);
    }

    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        if (Math.random() > 0.5) {
          return file;
        }

        this.failedFiles$.next(file);

        return null;
      }),
      finalize(() => this.loadingFiles$.next(null)),
    );
  }
}
