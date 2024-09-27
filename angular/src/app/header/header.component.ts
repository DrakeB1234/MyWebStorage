import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { AddfilesformmodalComponent } from '../addfilesformmodal/addfilesformmodal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, AddfilesformmodalComponent, NgIf],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

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

  // Add Files
  @Output() toggleAddFilesComponent = new EventEmitter<void>();

  toggleAddFiles() {
    this.toggleAddFilesComponent.emit();
    this.isDropdownOpen = false;
  }
}
