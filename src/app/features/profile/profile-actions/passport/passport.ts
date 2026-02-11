import { CommonModule, AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiDialog, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiFileLike, TuiFiles } from '@taiga-ui/kit';
import { Subject, switchMap, Observable, of, timer, map, finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Empty } from '../../../../shared/components/empty/empty';

@Component({
  selector: 'app-passport',
  imports: [
    TuiIcon,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
    FormsModule,
    TuiButton,
    TuiIcon,
    RouterLink,
    TuiDialog,
    TuiHint,
    AsyncPipe,
    TuiFiles,
    Empty,
  ],
  templateUrl: './passport.html',
  styleUrl: './passport.scss',
  host: {
    class: 'p-4 ps-5 pl-5  block',
  },
})
export class Passport implements OnInit {
  protected open = false;
  passportForm = new FormGroup({});
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  user: any;

  ngOnInit(): void {
    this.user = this.route.parent?.snapshot.data['user'];
    console.log(this.user);
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

  // --- SUBMIT LOGIC ---
  onSubmit(observer: any): void {
    const rawFile = this.control.value;

    if (!rawFile) return;

    const file = rawFile as File;
    const formData = new FormData();

    // 1. Append the file (Key must match 'upload.single' in backend)
    formData.append('document', file);

    // 2. Append the DocType (Required by your Schema)
    formData.append('docType', 'passport');

    // 3. UI Loading State
    this.loadingFiles$.next(rawFile);

    // 4. Send Request
    this.http
      .post('http://localhost:3000/api/v1/users/upload-passport', formData)
      .pipe(finalize(() => this.loadingFiles$.next(null)))
      .subscribe({
        next: (res) => {
          console.log('Passport uploaded successfully', res);
          observer.complete(); // Close dialog
          this.removeFile(); // Reset form

          // Optional: Reload user data here to update the list in the UI
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.failedFiles$.next(rawFile); // Show error state
        },
      });
  }

  hasPassport(documents: any[]): boolean {
    // Checks if the array exists and if any document has docType 'passport'
    return documents?.some((doc: any) => doc.docType === 'passport') || false;
  }
}
