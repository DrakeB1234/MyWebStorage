import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Components
import { HeaderComponent } from '../header/header.component';
import { ShowfilesComponent } from '../showfiles/showfiles.component';
import { ShowfoldersComponent } from '../showfolders/showfolders.component';
import { ShowcurrentdirectoryComponent } from '../showcurrentdirectory/showcurrentdirectory.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ShowfilesComponent, ShowfoldersComponent, ShowcurrentdirectoryComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  title = "My Web Storage";
}
