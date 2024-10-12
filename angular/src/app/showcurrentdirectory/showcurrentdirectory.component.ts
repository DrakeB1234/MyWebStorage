import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FilesService } from '../services/files.service';
import { ModalService } from '../services/modal.service';
import { RenamefolderformComponent } from '../forms/renamefolderform/renamefolderform.component';

@Component({
  selector: 'app-showcurrentdirectory',
  standalone: true,
  imports: [CommonModule, RenamefolderformComponent],
  templateUrl: './showcurrentdirectory.component.html',
})
export class ShowcurrentdirectoryComponent implements OnInit {

  filesService = inject(FilesService);
  modalService = inject(ModalService);
  currentPath: string = "";
  currentPathParse: string = "";
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

  // Folder functions and modals
  @ViewChild('deleteFolderTemplate', { static: true }) deleteFolderTemplate!: TemplateRef<any>;
  @ViewChild('renameFolderTemplate', { static: true }) renameFolderTemplate!: TemplateRef<any>;

  deleteFolderModal () {
    let newPath = "";
    if (this.currentPath !== "My Web Storage") {
      newPath = `MWS${this.currentPath}`;
    } else {
      newPath = this.currentPath;
    }

    this.modalService.open({ 
      title: `Delete folder ${newPath}?`,
      message: `This will delete the folder "${newPath}" ONLY if there is no files or folders inside`, 
      contentTemplate: this.deleteFolderTemplate
    }
    );
  }

  deleteFolder() {
    console.log('delete');
    this.closeModal();
  }

  renameFolderModal() {
    let newPath = "";
    if (this.currentPath !== "My Web Storage") {
      newPath = `MWS${this.currentPath}`;
    } else {
      newPath = this.currentPath;
    }

    this.modalService.open({ 
      title: `Rename folder`,
      message: `${newPath}`, 
      contentTemplate: this.renameFolderTemplate
    }
    );
  }

  closeModal(): void {
    this.modalService.close();
  }

  // Toggles
  isFolderFunctionsOpen: boolean = false;

  toggleFolderFunctions() {
    this.isFolderFunctionsOpen = !this.isFolderFunctionsOpen;
  }
}
