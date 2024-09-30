import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import apiEndpoints from '../../api-endpoints.json';
import { FileData } from '../Models/filedata.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor() {}

  private http = inject(HttpClient);
  apiEndpoints = apiEndpoints;

  private refreshFilesSubject = new BehaviorSubject<boolean>(false);
  refreshFiles$ = this.refreshFilesSubject.asObservable();

  getFiles(): Observable<FileData[]> {
    return this.http.get<FileData[]>(apiEndpoints.GetAllFilePaths);
  }

  postFiles(data: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(apiEndpoints.postFiles, data, { headers });
  }

  refreshFiles() {
    console.log(this.refreshFilesSubject.next);
    this.refreshFilesSubject.next(true);
  }
}
