import { Component, inject, OnInit } from '@angular/core';
import { FileData } from '../../Models/filedata.model';
import { FilesService } from '../services/files.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-showfiles',
  standalone: true,
  imports: [AsyncPipe],
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
}
