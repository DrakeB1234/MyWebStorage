import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FilesService } from '../files.service';

@Component({
  selector: 'app-showcurrentdirectory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showcurrentdirectory.component.html',
})
export class ShowcurrentdirectoryComponent implements OnInit {

  filesService = inject(FilesService);
  currentPath: string = "";
  // Regex to remove last folder in path
  regexRemoveLastPath: RegExp = /[\/\\][^\\\/]+?$/;

  ngOnInit(): void {
    this.getCurrentPath();

    // Subscribe to the refresh event and re-fetch data when triggered
    this.filesService.refreshCurrentPath$.subscribe((shouldRefresh) => {
      if (shouldRefresh) {
        this.getCurrentPath();
      }
    });
  }

  getCurrentPath() {
    // If empty path, then assume root
    this.currentPath = this.filesService.getCurrentPath();
  }

  previousPath() {
    // Check if path is not from root (no slashes), then set current path to empty
    if (!this.currentPath.includes('/')) {
      this.filesService.updatePath("");
    }
    else {
      this.filesService.updatePath(this.currentPath.replace(this.regexRemoveLastPath, ""));
    }

    // Refresh path
    this.filesService.refreshAllData();
  }
}
