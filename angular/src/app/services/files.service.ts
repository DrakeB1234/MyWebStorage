import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import apiEndpoints from '../../../api-endpoints.json';
import { FileData } from '../../Models/filedata.model';
import { FolderData } from '../../Models/folderdata.model';
import { environment } from '../../environments/environment.development';
import { MoveFile } from '../../Models/movefile.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor() {}

  private http: HttpClient = inject(HttpClient);
  // API
  apiUrl: string = environment.apiUrl;
  apiEndpoints: typeof apiEndpoints = apiEndpoints;

  // Keeps track of the current directory that user is on
  // If empty, then root path is implied
  currentPath: string = "";
  currentPathFolderName: string = "";

  // Subscribables to check for changes of data from api
  private refreshFilesSubject = new BehaviorSubject<boolean>(false);
  refreshFiles$ = this.refreshFilesSubject.asObservable();

  private refreshFoldersSubject = new BehaviorSubject<boolean>(false);
  refreshFolders$ = this.refreshFoldersSubject.asObservable();

  private refreshCurrentPathSubject = new BehaviorSubject<boolean>(false);
  refreshCurrentPath$ = this.refreshCurrentPathSubject.asObservable();

  // Files

  getFiles(): Observable<FileData[]> {
    // Encode path to ensure proper data is sent
    return this.http.get<FileData[]>(this.apiUrl + apiEndpoints.getAllFilePaths + encodeURIComponent(this.currentPath));
  }

  addFile(data: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(this.apiUrl + apiEndpoints.addFile, data, { headers });
  }

  moveFile(fileData: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(this.apiUrl + apiEndpoints.moveFile, fileData, { headers });
  }

  downloadFile(fileName: string): Observable<any> {
    return this.http.get(this.apiUrl + apiEndpoints.downloadFile + encodeURIComponent(this.currentPath + `/${fileName}`), { responseType: 'blob' });
  }

  deleteFile(fileName: string): Observable<any> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    return this.http.delete(this.apiUrl + apiEndpoints.deleteFile, { body: { FileName: this.currentPath + `/${fileName}` }, headers: headers });
  }

  refreshFiles() {
    this.refreshFilesSubject.next(true);
  }

  getCompressedImage(fileName: string): string {
    // Used by <img> src to get image
    if (this.currentPath == "") {
      return this.apiUrl + apiEndpoints.getCompressedImage + fileName;
    }
    // Encode URI after endpoint to ensure GET req can read data
    return this.apiUrl + apiEndpoints.getCompressedImage + encodeURIComponent(this.currentPath + "/" + fileName);
  }

  getFullImage(fileName: string): string {
    // Used by <img> src to get image
    if (this.currentPath == "") {
      return this.apiUrl + apiEndpoints.getFullImage + fileName;
    }
    // Encode URI after endpoint to ensure GET req can read data
    return this.apiUrl + apiEndpoints.getFullImage + encodeURIComponent(this.currentPath + "/" + fileName);
  }

  // Folders

  getFolders(): Observable<FolderData[]> {
    // Gets path that is set in filesservice, path updates from the component 'showfolders'
    // Encode path to ensure proper data is sent
    return this.http.get<FolderData[]>(this.apiUrl + apiEndpoints.getAllDirectories + encodeURIComponent(this.currentPath));
  }

  getAllFolders(): Observable<FolderData[]> {
    // Gets path that is set in filesservice, path updates from the component 'showfolders'
    // Encode path to ensure proper data is sent
    return this.http.get<FolderData[]>(this.apiUrl + apiEndpoints.getAllRootDirectories);
  }

  postFolder(data: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.post(this.apiUrl + apiEndpoints.postDirectory, data, { headers });
  }

  deleteFolder(data: any): Observable<any> {
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');
    return this.http.delete(this.apiUrl + apiEndpoints.deleteDirectory, { body: data, headers: headers });
  }

  refreshFolders() {
    this.refreshFoldersSubject.next(true);
  }

  // Path

  getCurrentPath(): string {
    // If empty path, then assume root
    if (this.currentPath === "") {
      return "My Web Storage"
    }
    else {
      return this.currentPath;
    }
  }

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
