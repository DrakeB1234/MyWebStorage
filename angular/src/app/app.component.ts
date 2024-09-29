import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AddfilesformmodalComponent } from './addfilesformmodal/addfilesformmodal.component';
import { FilesService } from './files.service';
import { FileData } from '../Models/filedata.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AddfilesformmodalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  filesService = inject(FilesService);
  apiEndpoints: any = this.filesService.apiEndpoints;
  files: FileData[] = [];

  ngOnInit(): void {
    this.getFilesData();
  }

  getFilesData() {
    console.log('hello')
    this.filesService.getFiles().subscribe({
      next: (data: FileData[]) => {
        this.files = data;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  // Toggles
  isAddFilesModalOpen: boolean = false;

  toggleAddFilesModal() {
    this.isAddFilesModalOpen = !this.isAddFilesModalOpen;
  }
}