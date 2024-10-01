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
    var tempCurrentPath = this.filesService.currentPath
    if (tempCurrentPath === "") {
      this.currentPath = "My Web Storage"
    }
    else {
      this.currentPath = this.filesService.currentPath;
    }
  }
}
