import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { AddfilesformmodalComponent } from '../addfilesformmodal/addfilesformmodal.component';
import { FilesService } from '../services/files.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, AddfilesformmodalComponent, NgIf],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  filesService = inject(FilesService);
  authService = inject(AuthService);
  isDropdownOpen: boolean = false;
  
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
