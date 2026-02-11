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
import { UserService } from '../../../../core/services/user-service';
import { Auth } from '../../../../core/services/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
environment;
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
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConfirm: new FormControl('', [Validators.required]),
      passwordCurrent: new FormControl('', [Validators.required]),
    },
    { validators: this.matchPasswords },
  );

  http = inject(HttpClient);
  baseURL = environment.baseUrl;

  protected open = false;
  protected userService = inject(UserService);
  protected authService = inject(Auth);

  user: any;

  ngOnInit(): void {
    this.userService.getUser().subscribe((res) => {
      this.user = res;
      console.log(this.user);
    });
  }

  submit() {
    if (this.editForm.valid) {
      this.userService.changePassword(this.editForm.value).subscribe((res) => {
        this.authService.setNewToken(res.token);
      });
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  // Custom Validator Function
  matchPasswords(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('passwordConfirm')?.value;
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

    // Immediately return the file so it appears in the list as "ready"
    return of(file);
  }

  onImgSubmit(observer: any): void {
    const rawFile = this.control.value;

    if (!rawFile) return;

    const file = rawFile as File;
    const formData = new FormData();

    // 'image' is the key your backend expects. Change if needed (e.g., 'avatar')
    formData.append('image', file);

    // Set loading state (shows spinner on the file row)
    this.loadingFiles$.next(rawFile);

    this.http
      .post('http://localhost:3000/upload-avatar', formData)
      .pipe(
        finalize(() => {
          // Stop loading animation regardless of success/error
          this.loadingFiles$.next(null);
        }),
      )
      .subscribe({
        next: (res) => {
          console.log('Upload success');
          observer.complete(); // Closes the dialog
          this.control.setValue(null); // Reset the input
        },
        error: (err) => {
          console.error(err);
          this.failedFiles$.next(rawFile); // Shows red error state on file
        },
      });
  }

  createImagePath(imageName: string) {
    return `${this.baseURL}/images/${imageName}`;
  }
}
