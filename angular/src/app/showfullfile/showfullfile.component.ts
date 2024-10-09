import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FilesService } from '../services/files.service';
import { FileData } from '../../Models/filedata.model';
import Exif from 'exif-js';
import { CommonModule } from '@angular/common';
import { MoveFile } from '../../Models/movefile.model';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { MovefilemodalComponent } from '../movefilemodal/movefilemodal.component';

@Component({
  selector: 'app-showfullfile',
  standalone: true,
  imports: [CommonModule, ConfirmdialogComponent, MovefilemodalComponent],
  templateUrl: './showfullfile.component.html',
})
export class ShowfullfileComponent implements OnInit {
  @Input() file!: FileData | null;
  @Output() closeShowFullFile = new EventEmitter<void>();
  @Output() changeShowFullFile = new EventEmitter<number>();

  filesService = inject(FilesService);
  fileCreationDate: Date | null = null;
  timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  ngOnInit(): void {
    // Convert file.fileCreationDate to date
    if (this.file !== null) {
      this.fileCreationDate = new Date(this.file.fileCreationDate);
    }
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

  convertFileLength(bytes: number, decimals: number): string {
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  // File Functions

  moveFile(formData: MoveFile): void {
    if (this.file) {
      this.filesService.moveFile(formData).subscribe({
        next: (data: any) => {
          // Switch to next file to left
          this.changeFile(1);
          // Close full file and refresh data
          this.filesService.refreshFiles();
          },
        error: (err: any) => {
          console.log(err);
        }
      })
    }  
    this.toggleMoveFile();
  }

  downloadFile(): void {
    if (this.file) {
      this.filesService.downloadFile(this.file.fileName).subscribe({
        next: (data: any) => {
          if (this.file) {
            const downloadURL = URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = downloadURL;
            link.download = this.file.fileName;
            link.click();
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      })
    }
  }

  deleteFile(): void {
    if (this.file) {
      this.filesService.deleteFile(this.file.fileName).subscribe({
        next: (data: any) => {
          // Switch to next file to left
          this.changeFile(1);
          // Close full file and refresh data
          this.filesService.refreshFiles();
        },
        error: (err: any) => {
        }
      })
    }
  }

  changeFile(itr: number): void {
    this.changeShowFullFile.emit(itr);
  }

  // Toggles
  showFileDetails: boolean = false;
  showFileFunctions: boolean = false;
  showMoveFile: boolean = false;

  toggleMoveFile() {
    this.showMoveFile = !this.showMoveFile;
  }

  getMoveFileData(fileDestination: any) {
    if (this.file) {
      const formData = { 
        FileName: this.file.fileName, 
        FilePath: this.file.fileDirectoryName,
        FileDestination: fileDestination 
      } as MoveFile;
      this.moveFile(formData);
    }
  }

  toggleShowFileDetail() {
    this.showFileDetails = !this.showFileDetails;
    this.showFileFunctions = false;
  }

  toggleShowFileFunctions() {
    this.showFileFunctions = !this.showFileFunctions;
    this.showFileDetails = false;
  }

  toggleShowFullFile() {
    this.closeShowFullFile.emit();
  }

}
