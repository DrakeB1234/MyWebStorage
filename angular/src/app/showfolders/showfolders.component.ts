import { Component, inject, OnInit } from '@angular/core';
import { FilesService } from '../services/files.service';
import { FolderData } from '../../Models/folderdata.model';

@Component({
  selector: 'app-showfolders',
  standalone: true,
  imports: [],
  templateUrl: './showfolders.component.html',
})
export class ShowfoldersComponent implements OnInit {
  filesService = inject(FilesService);
  folders: FolderData[] = [];

  ngOnInit(): void {
    this.getFoldersData();

    // Subscribe to the refresh event and re-fetch data when triggered
    this.filesService.refreshFolders$.subscribe((shouldRefresh) => {
      if (shouldRefresh) {
        this.getFoldersData();
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

  openFolderSettings(): void {
  }
}
