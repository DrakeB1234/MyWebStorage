import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FilesService } from '../services/files.service';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';
import { AddfilesformComponent } from "../forms/addfilesform/addfilesform.component";
import { AddfolderformComponent } from "../forms/addfolderform/addfolderform.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AddfilesformComponent, AddfolderformComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  filesService = inject(FilesService);
  authService = inject(AuthService);
  modalService = inject(ModalService);
  currentPath = "";
  isDropdownOpen: boolean = false;

  ngOnInit(): void {
    this.currentPath = this.filesService.getCurrentPath();

    this.filesService.refreshCurrentPath$.subscribe(() => {
      this.currentPath = this.filesService.getCurrentPath();
    });
  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Functions and modals
  @ViewChild('addFilesTemplate', { static: true }) addFilesTemplate!: TemplateRef<any>;
  @ViewChild('addFolderTemplate', { static: true }) addFolderTemplate!: TemplateRef<any>;

  addFilesModal() {
    let newPath = "";
    if (this.currentPath !== "My Web Storage") {
      newPath = `MWS${this.currentPath}`;
    } else {
      newPath = this.currentPath;
    }

    this.modalService.open({ 
      title: `Upload Files to`,
      message: `${newPath}`, 
      contentTemplate: this.addFilesTemplate
    }
    );

    this.isDropdownOpen = false;
  }

  addFolderModal() {
    let newPath = "";
    if (this.currentPath !== "My Web Storage") {
      newPath = `MWS${this.currentPath}`;
    } else {
      newPath = this.currentPath;
    }

    this.modalService.open({ 
      title: `Upload Folder to`,
      message: `${newPath}`, 
      contentTemplate: this.addFolderTemplate
    }
    );

    this.isDropdownOpen = false;
  }

  closeModal(): void {
    this.modalService.close();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.relative');

    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
}
