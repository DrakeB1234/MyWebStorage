import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ServerInfo } from '../../Models/serverinfo.model';
import { FilesService } from '../services/files.service';

@Component({
  selector: 'app-serverinfo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './serverinfo.component.html',
})
export class ServerinfoComponent implements OnInit {
  @Output() toggleServerInfo = new EventEmitter<void>();
  filesService = inject(FilesService);
  serverInfo: ServerInfo | null = null;

  ngOnInit(): void {
    this.filesService.getServerInfo().subscribe({
      next: (data: any | ServerInfo) => {
        data = data.data;
        this.serverInfo = {...this.serverInfo, 
          serverCurrentStorageFormat: this.convertFileLength(data.serverCurrentStorage, 1),
          serverMaxStorageFormat: this.convertFileLength(data.serverMaxStorage, 1),
          serverTemperture: data.serverTemperture,
          storedFiles: data.storedFiles,
          serverUptime: data.serverUptime
        };
        console.log("FRONT:", this.serverInfo);
      },
      error: (err: any) => {
        // Display error message in place of data
        this.serverInfo = null;
      }
    });
  }

  convertFileLength(bytes?: number, decimals?: number): string {
    console.log(bytes, decimals)
    if (!bytes || !decimals) return "";
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  closeServerInfo() {
    this.toggleServerInfo.emit();
  }
}
