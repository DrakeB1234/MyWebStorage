import { Component, inject, OnInit } from '@angular/core';
import { FileData } from '../../Models/filedata.model';
import { FilesService } from '../services/files.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ShowfullfileComponent } from '../showfullfile/showfullfile.component';

@Component({
  selector: 'app-showfiles',
  standalone: true,
  imports: [AsyncPipe, ShowfullfileComponent, CommonModule],
  templateUrl: './showfiles.component.html',
})
export class ShowfilesComponent implements OnInit {

  filesService = inject(FilesService);
  apiEndpoints: typeof this.filesService.apiEndpoints = this.filesService.apiEndpoints;
  files: FileData[] = [];

  ngOnInit(): void {
    this.getFilesData();

    // Subscribe to the refresh event and re-fetch data when triggered
    this.filesService.refreshFiles$.subscribe((shouldRefresh) => {
      if (shouldRefresh) {
        this.getFilesData();
      }
    });
  }

  getFilesData() {
    // Reset files to empty list to prevent trying to get old list of files 
    // Before get req is resolved
    this.files = [];
    
    this.filesService.getFiles().subscribe({
      next: (data: any) => {
        this.files = data.files;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // Toggles
  isShowFullFileOpen: boolean = false;
  fullFile: FileData | null = null;
  fullFileIndex: number | null = null;
  
  openShowFullFile(file: FileData, index: number) {
    this.fullFile = file;
    this.fullFileIndex = index;
    this.isShowFullFileOpen = true;
  }

  changeShowFullFile(itr?: number) {
    if (itr && this.fullFileIndex !== null) {
      // Determine if index is in valid range
      this.fullFileIndex += itr;
      if (this.fullFileIndex > this.files.length - 1) {
        this.fullFileIndex = 0;
        this.fullFile = this.files[this.fullFileIndex];
        this.isShowFullFileOpen = true;
      }
      else if (this.fullFileIndex < 0) {
        // Reset index, don't rerender
        this.fullFileIndex = 0;
      }
      else {
        this.fullFile = this.files[this.fullFileIndex];
        this.isShowFullFileOpen = true;
      }
    }
  }

  closeShowFullFile() {
    this.isShowFullFileOpen = false;
  }
}
