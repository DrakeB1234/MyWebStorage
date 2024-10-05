import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FilesService } from '../services/files.service';
import { FileData } from '../../Models/filedata.model';
import Exif from 'exif-js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-showfullfile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showfullfile.component.html',
})
export class ShowfullfileComponent implements OnInit {
  @Input() file!: FileData | null;
  @Output() closeShowFullFile = new EventEmitter<void>();

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

  convertFileLength(bytes: number, decimals: number): string {
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  // Toggles
  showFileDetails: boolean = false;

  toggleShowFileDetail() {
    this.showFileDetails = !this.showFileDetails;
  }

  toggleShowFullFile() {
    this.closeShowFullFile.emit();
  }

}
