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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TuiButton, TuiDialog, TuiHint, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiFileLike, TuiFiles } from '@taiga-ui/kit';
import { Subject, switchMap, Observable, of, timer, map, finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { Empty } from '../../../../shared/components/empty/empty';

@Component({
  selector: 'app-other-docs',
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
  templateUrl: './other-docs.html',
  styleUrl: './other-docs.scss',
  host: {
    class: 'p-4 ps-5 pl-5  block',
  },
})
export class OtherDocs implements OnInit {
  protected open = false;
  otherDocsForm = new FormGroup({
    title: new FormControl('', Validators.required),
  });
  docType: string = 'other';
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  user: any;
  baseUrl: string = environment.baseUrl;

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

  // Helper for HTML to access controls easily
  get f() {
    return this.otherDocsForm.controls;
  }

  // --- SUBMIT LOGIC ---
  onSubmit(observer: any): void {
    // A. Validate the Title Form first
    if (this.otherDocsForm.invalid) {
      this.otherDocsForm.markAllAsTouched(); // Triggers the red error text
      return;
    }

    // B. Validate the File
    const rawFile = this.control.value;
    if (!rawFile) return;

    const file = rawFile as File;
    const title = this.otherDocsForm.get('title')?.value; // Get the title value

    // C. Build the FormData
    const formData = new FormData();

    formData.append('document', file);
    formData.append('docType', this.docType);

    // ✅ Append the title here
    formData.append('title', title || '');

    this.loadingFiles$.next(rawFile);

    this.http
      .post('http://localhost:3000/api/v1/users/upload-document', formData)
      .pipe(finalize(() => this.loadingFiles$.next(null)))
      .subscribe({
        next: (res) => {
          console.log(`Document uploaded successfully`, res);
          observer.complete();
          this.removeFile();
          this.otherDocsForm.reset(); // Clear the title field after success
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.failedFiles$.next(rawFile);
        },
      });
  }

  hasOther(documents: any[]): boolean {
    // Checks if the array exists and if any document has docType 'passport'
    return documents?.some((doc) => doc.docType === 'other') || false;
  }

  getOtherDocs(documents: any[]): any[] {
    // Returns an array of passport objects, or an empty array if none found
    return documents ? documents.filter((doc) => doc.docType === 'other') : [];
  }
}
