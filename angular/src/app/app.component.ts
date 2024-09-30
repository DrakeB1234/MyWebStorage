import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { HeaderComponent } from './header/header.component';
import { AddfilesformmodalComponent } from './addfilesformmodal/addfilesformmodal.component';
import { ShowfilesComponent } from './showfiles/showfiles.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AddfilesformmodalComponent, ShowfilesComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {

  // Toggles
  isAddFilesModalOpen: boolean = false;

  toggleAddFilesModal() {
    this.isAddFilesModalOpen = !this.isAddFilesModalOpen;
  }
}