import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Photo } from '../Models/photo.model';
import { AsyncPipe, DecimalPipe, NgOptimizedImage, NgFor, CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AddfilesformmodalComponent } from './addfilesformmodal/addfilesformmodal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, DecimalPipe, NgOptimizedImage, NgFor, CommonModule, HeaderComponent, AddfilesformmodalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  private url: string = 'https://localhost:7160/api/Photos/GetAllPhotos';
  data: Photo[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    fetch(this.url)
      .then((response) => response.json())
      .then((photosData) => {
        this.isLoading = false;
        this.data = photosData
      });
  }

  // Toggles
  isAddFilesModalOpen: boolean = false;

  toggleAddFilesModal() {
    this.isAddFilesModalOpen = !this.isAddFilesModalOpen;
  }
}