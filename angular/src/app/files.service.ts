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
  // If empty, then root path is implied
  currentPath: string = "";
  currentPathFolderName: string = "";

  private refreshFilesSubject = new BehaviorSubject<boolean>(false);
  refreshFiles$ = this.refreshFilesSubject.asObservable();

  private refreshFoldersSubject = new BehaviorSubject<boolean>(false);
  refreshFolders$ = this.refreshFoldersSubject.asObservable();

  private refreshCurrentPathSubject = new BehaviorSubject<boolean>(false);
  refreshCurrentPath$ = this.refreshCurrentPathSubject.asObservable();

  // Files

  getFiles(): Observable<FileData[]> {
    return this.http.get<FileData[]>(apiEndpoints.GetAllFilePaths + `${this.currentPath}`);
  }

  postFiles(data: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(apiEndpoints.postFiles, data, { headers });
  }

  refreshFiles() {
    this.refreshFilesSubject.next(true);
  }

  // Folders

  getFolders(): Observable<FolderData[]> {
    // Gets path that is set in filesservice, path updates from the component 'showfolders'
    return this.http.get<FolderData[]>(apiEndpoints.getAllDirectories + `${this.currentPath}`);
  }

  postFolder(data: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(apiEndpoints.postDirectory, data, { headers });
  }

  refreshFolders() {
    this.refreshFoldersSubject.next(true);
  }

  // Path

  updatePath(path: string): void {
    // If empty path, then assume root
    this.currentPath = path;
  }

  refreshCurrentPath() {
    this.refreshCurrentPathSubject.next(true);
  }

  // Refresh all data across app
  refreshAllData () {
      // Refresh data across app
      this.refreshCurrentPath();
      this.refreshFolders();
      this.refreshFiles();
  }
}
