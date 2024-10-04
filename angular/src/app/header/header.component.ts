import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { AddfilesformmodalComponent } from '../addfilesformmodal/addfilesformmodal.component';
import { FilesService } from '../services/files.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, AddfilesformmodalComponent, NgIf],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  filesService = inject(FilesService);
  authService = inject(AuthService);
  isDropdownOpen: boolean = false;
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
    this.currentPath = this.filesService.getCurrentPath();
  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.relative');

    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }

  // Toggles
  @Output() toggleAddFilesComponent = new EventEmitter<void>();
  @Output() toggleAddFolderComponent = new EventEmitter<void>();

  toggleAddFiles() {
    this.toggleAddFilesComponent.emit();
    this.isDropdownOpen = false;
  }

  toggleAddFolder() {
    this.toggleAddFolderComponent.emit();
    this.isDropdownOpen = false;
  }
}
