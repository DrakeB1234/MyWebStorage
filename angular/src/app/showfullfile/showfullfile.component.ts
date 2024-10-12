import { Component, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FilesService } from '../services/files.service';
import { FileData } from '../../Models/filedata.model';
import { CommonModule } from '@angular/common';
import { ModalService } from '../services/modal.service';
import { MovefileformComponent } from "../forms/movefileform/movefileform.component";

@Component({
  selector: 'app-showfullfile',
  standalone: true,
  imports: [CommonModule, MovefileformComponent],
  templateUrl: './showfullfile.component.html',
})
export class ShowfullfileComponent implements OnInit {
  @Input() file!: FileData | null;
  @Output() closeShowFullFile = new EventEmitter<void>();
  @Output() changeShowFullFile = new EventEmitter<number>();

  filesService = inject(FilesService);
  modalService = inject(ModalService);

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

  convertFileLength(bytes: number, decimals: number): string {
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  // File Functions and modals
  @ViewChild('deleteFileTemplate', { static: true }) deleteFileTemplate!: TemplateRef<any>;
  @ViewChild('moveFileTemplate', { static: true }) moveFileTemplate!: TemplateRef<any>;

  deleteFileModal () {
    this.modalService.open({ 
      title: `Delete file ${this.file?.fileName}?`,
      message: `This will delete the file "${this.file?.fileName}", there is no way to revert this action`, 
      contentTemplate: this.deleteFileTemplate
    }
    );
  }

  moveFileModal () {
    this.modalService.open({ 
      title: `Move file ${this.file?.fileName}`,
      contentTemplate: this.moveFileTemplate
    }
    );
  }

  closeModal() {
    this.modalService.close();
  }

  moveFileSubmitted(): void {
    // Switch to next file to left
    this.changeFile(1);
    // Close full file and refresh data
    this.filesService.refreshAllData();
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
        }
      });
    }
    this.closeModal();
  }

  changeFile(itr: number): void {
    this.changeShowFullFile.emit(itr);
  }

  // Toggles
  showFileDetails: boolean = false;
  showFileFunctions: boolean = false;

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
