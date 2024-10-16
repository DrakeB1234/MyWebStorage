import { Component, inject, OnInit } from '@angular/core';
import { FilesService } from '../services/files.service';
import { FolderData } from '../../Models/folderdata.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-showfolders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showfolders.component.html',
})
export class ShowfoldersComponent implements OnInit {
  filesService = inject(FilesService);
  folders: FolderData[] = [];
  currentPath = "";

  ngOnInit(): void {
    this.getFoldersData();

    // Subscribe to the refresh event and re-fetch data when triggered
    this.filesService.refreshFolders$.subscribe((shouldRefresh) => {
      if (shouldRefresh) {
        this.getFoldersData();
        this.currentPath = this.filesService.getCurrentPath();
      }
    });
  }

  getFoldersData() {
    this.filesService.getFolders().subscribe({
      next: (data: FolderData[]) => {
        this.folders = data;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  openFolderPath(path: string): void {
    this.filesService.updatePath(path);

    // Refresh data across app
    this.filesService.refreshAllData();
  }
}
