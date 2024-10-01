import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { HeaderComponent } from './header/header.component';
import { AddfilesformmodalComponent } from './addfilesformmodal/addfilesformmodal.component';
import { ShowfilesComponent } from './showfiles/showfiles.component';
import { ShowfoldersComponent } from './showfolders/showfolders.component';
import { AddfoldermodalComponent } from './addfoldermodal/addfoldermodal.component';
import { ShowcurrentdirectoryComponent } from './showcurrentdirectory/showcurrentdirectory.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AddfilesformmodalComponent, ShowfilesComponent, ShowfoldersComponent, AddfoldermodalComponent, ShowcurrentdirectoryComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {

  // Toggles
  isAddFilesModalOpen: boolean = false;
  isAddFolderModalOpen: boolean = false;

  toggleAddFilesModal() {
    this.isAddFilesModalOpen = !this.isAddFilesModalOpen;
  }

  toggleAddFolderModal() {
    this.isAddFolderModalOpen = !this.isAddFolderModalOpen;
  }
}