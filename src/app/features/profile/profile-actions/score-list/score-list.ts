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
import { Empty } from '../../../../shared/components/empty/empty';
import { environment } from '../../../../../environments/environment.development';
import { JalaliPipe } from '../../../../shared/pipes/jalali-pipe';

@Component({
  selector: 'app-score-list',
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
    JalaliPipe,
  ],
  templateUrl: './score-list.html',
  styleUrl: './score-list.scss',
  host: {
    class: 'p-4 ps-5 pl-5  block',
  },
})
export class ScoreList implements OnInit {
  protected open = false;
  scoreForm = new FormGroup({});
  user: any;
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  docType: string = 'scoreList';
  baseUrl: string = environment.baseUrl;
  apiUrl: string = environment.apiUrl;

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

  onSubmit(observer: any): void {
    const rawFile = this.control.value;
    if (!rawFile) return;

    const file = rawFile as File;
    const formData = new FormData();

    // 2. Append the file
    formData.append('document', file);

    // 3. Append the Dynamic DocType
    // instead of hardcoding 'passport', we use this.docType
    formData.append('docType', this.docType);

    this.loadingFiles$.next(rawFile);

    // 4. Update URL to the GENERIC endpoint
    // Do not use /upload-passport, use /upload-document
    this.http
      .post(`${this.apiUrl}/users/upload-document`, formData)
      .pipe(finalize(() => this.loadingFiles$.next(null)))
      .subscribe({
        next: (res) => {
          console.log(`${this.docType} uploaded successfully`, res);
          observer.complete();
          this.removeFile();
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.failedFiles$.next(rawFile);
        },
      });
  }

  hasScore(documents: any[]): boolean {
    // Checks if the array exists and if any document has docType 'scoreList'
    return documents?.some((doc) => doc.docType === 'scoreList') || false;
  }

  getScoreDocs(documents: any[]): any[] {
    // Returns an array of passport objects, or an empty array if none found
    return documents ? documents.filter((doc) => doc.docType === 'scoreList') : [];
  }
}
