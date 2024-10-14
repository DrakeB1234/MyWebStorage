import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FileData } from '../../Models/filedata.model';
import { FilesService } from '../services/files.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

// Components
import { ShowfullfileComponent } from '../showfullfile/showfullfile.component';
import { ModalService } from '../services/modal.service';
import { MovefileformComponent } from "../forms/movefileform/movefileform.component";

@Component({
  selector: 'app-showfiles',
  standalone: true,
  imports: [AsyncPipe, ShowfullfileComponent, CommonModule, MovefileformComponent],
  templateUrl: './showfiles.component.html',
})
export class ShowfilesComponent implements OnInit {

  filesService = inject(FilesService);
  modalService = inject(ModalService);
  apiEndpoints: typeof this.filesService.apiEndpoints = this.filesService.apiEndpoints;
  files: FileData[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getFilesData();

    // Subscribe to the refresh event and re-fetch data when triggered
    this.filesService.refreshFiles$.subscribe((shouldRefresh) => {
      if (shouldRefresh) {
        this.getFilesData();
      }
    });
  }

  getFilesData() {
    // Reset files to empty list to prevent trying to get old list of files 
    // Before get req is resolved
    this.files = [];
    
    this.filesService.getFiles().subscribe({
      next: (data: any) => {
        this.files = data.files;

        // Everytime data is refreshed, close multiselect
        this.closeMultiSelect();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // Multiselect functions and modals
  @ViewChild('deleteFileTemplate', { static: true }) deleteFileTemplate!: TemplateRef<any>;
  @ViewChild('moveFileTemplate', { static: true }) moveFileTemplate!: TemplateRef<any>;

  deleteFileModal () {
    if (this.selectedFiles.length > 0) {
      this.modalService.open({ 
        title: `Delete all selected ${this.selectedFiles.length} files?`,
        message: `This will delete all of the selected ${this.selectedFiles.length} files, there is no way to revert this action`, 
        contentTemplate: this.deleteFileTemplate
      }
      );
    }
  }

  moveFileModal () {
    if (this.selectedFiles.length > 0) {
      this.modalService.open({ 
        title: `Move all selected ${this.selectedFiles.length} files`,
        contentTemplate: this.moveFileTemplate
      }
      );
    }
  }

  moveFileSubmitted(): void {
    // Close full file and refresh data
    this.filesService.refreshAllData();
  }

  getFilesFromIndex(): FileData[] | null {
    if (this.selectedFiles.length > 0) {
      let filesList: FileData[] = [];
      this.selectedFiles.forEach((e: number) => {
        filesList.push(this.files[e]);
      });

      return filesList;
    }
    return null;
  }

  closeModal() {
    this.modalService.close();
  }

  isMultiSelectOpen: boolean = false;
  isMultiSelectOptionsOpen: boolean = false;
  selectedFiles: number[] = [];
  selectedFileCurrCount: number = 0;
  errorMessage: string[] = [];

  toggleMultiSelect() {
    this.isMultiSelectOpen = !this.isMultiSelectOpen;
    if (this.isMultiSelectOpen == false) {
      // If container is closed, then reset selectedFiles
      this.closeMultiSelect();
    }
  }

  toggleMultiSelectOptions() {
    this.isMultiSelectOptionsOpen = !this.isMultiSelectOptionsOpen;
  }

  closeMultiSelect() {
    this.selectedFiles = [];
    this.selectedFileCurrCount = 0;
    this.isMultiSelectOpen = false;
    this.isMultiSelectOptionsOpen = false;
  }

  addFileToSelection(index: number) {
    // See if file is already in selection, if so then remove
    if (this.selectedFiles.includes(index)) {
      const selectIndex = this.selectedFiles.indexOf(index);
      this.selectedFiles.splice(selectIndex, 1);
    } else {
      this.selectedFiles.push(index);
    }
  }

  addAllToSelection() {
    this.selectedFiles = [];
    for (let i = 0; i < this.files.length; i++) {
      this.selectedFiles.push(i);
    }
  }

  downloadFileSelection() {
    this.selectedFiles.forEach(async e => {
      const file = this.files[e];
      try {
        const data = await firstValueFrom(this.filesService.downloadFile(file.fileName));
        if (file) {
          const downloadURL = URL.createObjectURL(data);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = file.fileName;
          link.click();
        }
        this.selectedFileCurrCount++;
      } catch (error: any) {
        // Append error message
        this.errorMessage.push(error.error.message);
        this.selectedFileCurrCount++;
      }
    });

    // At end of function, reset values
    this.closeMultiSelect();
  }

  deleteFileSelection() {
    this.selectedFileCurrCount = 0;
    this.selectedFiles.forEach(async e => {
      const file = this.files[e];
      try {
        const data = await firstValueFrom(this.filesService.deleteFile(file.fileName));
        this.selectedFileCurrCount++;

      } catch (error: any) {
        // Append error message
        this.errorMessage.push(error.error.message);
        this.selectedFileCurrCount++;
      }

      // At end of function, reset values, refresh files
      if (this.selectedFiles.length === this.selectedFileCurrCount) {
        this.closeMultiSelect();
        this.filesService.refreshFiles();
      }
    });
    this.closeModal();
  }

  resetFileSelection() {
    this.selectedFiles = [];
  }

  // Toggles
  isShowFullFileOpen: boolean = false;
  fullFile: FileData | null = null;
  fullFileIndex: number | null = null;
  
  openShowFullFile(file: FileData, index: number) {
    this.fullFile = file;
    this.fullFileIndex = index;
    this.isShowFullFileOpen = true;
  }

  changeShowFullFile(itr?: number) {
    if (itr && this.fullFileIndex !== null) {
      // Determine if index is in valid range
      this.fullFileIndex += itr;
      if (this.fullFileIndex > this.files.length - 1) {
        this.fullFileIndex = 0;
        this.fullFile = this.files[this.fullFileIndex];
        this.isShowFullFileOpen = true;
      }
      else if (this.fullFileIndex < 0) {
        // Reset index, don't rerender
        this.fullFileIndex = 0;
      }
      else {
        this.fullFile = this.files[this.fullFileIndex];
        this.isShowFullFileOpen = true;
      }
    }
  }

  closeShowFullFile() {
    this.isShowFullFileOpen = false;
  }
}
