import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Components
import { HeaderComponent } from '../header/header.component';
import { AddfilesformmodalComponent } from '../addfilesformmodal/addfilesformmodal.component';
import { ShowfilesComponent } from '../showfiles/showfiles.component';
import { ShowfoldersComponent } from '../showfolders/showfolders.component';
import { AddfoldermodalComponent } from '../addfoldermodal/addfoldermodal.component';
import { ShowcurrentdirectoryComponent } from '../showcurrentdirectory/showcurrentdirectory.component';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AddfilesformmodalComponent, ShowfilesComponent, ShowfoldersComponent, AddfoldermodalComponent, ShowcurrentdirectoryComponent, ConfirmdialogComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = "My Web Storage";

  // Confirm Dialog
  isConfirmDialogOpen: boolean = false;
  confirmDialogRes: boolean = false;
  callbackFn: Function | null= null;
  dialogMessage: string = "";

  confirmDialog(callbackFn: Function, dialogMessage: string) {
    this.callbackFn = callbackFn;
    this.dialogMessage = dialogMessage;
    this.isConfirmDialogOpen = true;
  }

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
