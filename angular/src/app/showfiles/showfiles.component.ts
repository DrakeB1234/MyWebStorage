import { Component, inject, OnInit } from '@angular/core';
import { FileData } from '../../Models/filedata.model';
import { FilesService } from '../services/files.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

// Components
import { ShowfullfileComponent } from '../showfullfile/showfullfile.component';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { MovefilemodalComponent } from '../movefilemodal/movefilemodal.component';
import { MoveFile } from '../../Models/movefile.model';

@Component({
  selector: 'app-showfiles',
  standalone: true,
  imports: [AsyncPipe, ShowfullfileComponent, ConfirmdialogComponent, MovefilemodalComponent, CommonModule],
  templateUrl: './showfiles.component.html',
})
export class ShowfilesComponent implements OnInit {

  filesService = inject(FilesService);
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

  closeConfirmDialog() {
    this.isConfirmDialogOpen = false;
  }

  handleCallback() {
    if (this.callbackFn) this.callbackFn();
  }

  // Multiselect
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

  moveFileSelection(fileDestination: any): void {

    this.selectedFiles.forEach(async e => {
      const file = this.files[e];
      const formData = { 
        FileName: file.fileName, 
        FilePath: file.fileDirectoryName,
        FileDestination: fileDestination 
      } as MoveFile;
      
      try {
        const data = await firstValueFrom(this.filesService.moveFile(formData));
        this.selectedFileCurrCount++;
      } catch (error: any) {
        // Append error message
        this.errorMessage.push(error.error.message);
        this.selectedFileCurrCount++;
      }
    });

    // At end of function, reset values, refresh files
    this.closeMultiSelect();
    this.showMoveFile = false;
    this.filesService.refreshAllData();
  }

  getMoveFileData(fileDestination: any) {
    this.moveFileSelection(fileDestination);
  }

  deleteFileSelection() {
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
    });

    // At end of function, reset values, refresh files
    this.filesService.refreshFiles();
    this.closeMultiSelect();
  }

  resetFileSelection() {
    this.selectedFiles = [];
  }

  // Toggles
  isShowFullFileOpen: boolean = false;
  fullFile: FileData | null = null;
  fullFileIndex: number | null = null;
  showMoveFile: boolean = false;

  toggleMoveFile() {
    if (this.selectedFiles.length > 0) {
      this.showMoveFile = !this.showMoveFile;
    }
  }
  
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
