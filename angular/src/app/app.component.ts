import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from '../Models/photo.model';
import { AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, DecimalPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  http = inject(HttpClient);

  photos$ = this.getPhotos();
  
  private getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>("https://localhost:7160/api/Photos/GetAllPhotos");
  }
}