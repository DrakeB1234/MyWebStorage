import { Component, inject, OnInit } from '@angular/core';
import { FileData } from '../../Models/filedata.model';
import { FilesService } from '../files.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-showfiles',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './showfiles.component.html',
})
export class ShowfilesComponent implements OnInit {

  filesService = inject(FilesService);
  apiEndpoints: any = this.filesService.apiEndpoints;
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
    this.filesService.getFiles().subscribe({
      next: (data: FileData[]) => {
        this.files = data;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
