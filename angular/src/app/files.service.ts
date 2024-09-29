import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import apiEndpoints from '../../api-endpoints.json';
import { FileData } from '../Models/filedata.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor() {}

  private http = inject(HttpClient);
  apiEndpoints = apiEndpoints;

  getFiles(): Observable<FileData[]> {
    return this.http.get<FileData[]>(apiEndpoints.GetAllFilePaths).pipe(catchError(this.handleError));
  }

  postFiles(data: any) {
    console.log(data)
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(apiEndpoints.postFiles, data, { headers });
  }

  private handleError(err: any) {
    console.log(err);
    return throwError(() => new Error('Something went wrong'));
  }
}
