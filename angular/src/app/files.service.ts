import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import apiEndpoints from '../../api-endpoints.json';
import { FileData } from '../Models/filedata.model';
import { FolderData } from '../Models/folderdata.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor() {}

  private http: HttpClient = inject(HttpClient);
  apiEndpoints: typeof apiEndpoints = apiEndpoints;
  // Keeps track of the current directory that user is on
  currentPath: string = "";

  private refreshFilesSubject = new BehaviorSubject<boolean>(false);
  refreshFiles$ = this.refreshFilesSubject.asObservable();

  private refreshFoldersSubject = new BehaviorSubject<boolean>(false);
  refreshFolders$ = this.refreshFoldersSubject.asObservable();

  getFiles(): Observable<FileData[]> {
    return this.http.get<FileData[]>(apiEndpoints.GetAllFilePaths);
  }

  postFiles(data: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(apiEndpoints.postFiles, data, { headers });
  }

  refreshFiles() {
    this.refreshFilesSubject.next(true);
  }

  getFolders(path: string): Observable<FolderData[]> {
    return this.http.get<FolderData[]>(apiEndpoints.getAllDirectories);
  }

  postFolder(data: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(apiEndpoints.postDirectory, data, { headers });
  }

  refreshFolders() {
    this.refreshFoldersSubject.next(true);
  }
}
