import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilesService } from '../files.service';
import { FolderPostData } from '../../Models/folderpost.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addfoldermodal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addfoldermodal.component.html',
})
export class AddfoldermodalComponent {
  filesService = inject(FilesService);

  folderForm: FormGroup;
  folderData: FolderPostData | null = null;
  postFolderLoading: boolean = false;

  constructor() {
    // Initialize the form group and its controls
    this.folderForm = new FormGroup({
      folderName: new FormControl('', [Validators.required]),
      folderPath: new FormControl('', [Validators.required])
    });
  }
  
  @Output() toggleAddFolderComponent = new EventEmitter<void>();

  // Form Handler

  // Function to handle file selection
  onFolderFormChange(event: any) {
    // Get the selected files from the event
    this.folderData = { folderName: event.target.folderName, folderPath: event.target.folderPath } as FolderPostData;
  }

  // Submit File Function
  submitFiles() {

    // Add loading attr to disable submit button and loading symbol
    this.postFolderLoading = true;
    
    // Ensures that folder data has a value set
    if (this.folderForm.valid && this.folderData) {
      this.filesService.postFolder(this.folderData).subscribe({
        next: (data: any) => {
          // Close form and stop loading
          this.postFolderLoading = false;
          this.toggleAddFolder();
          // Refresh files data
          this.refreshFolderData();
        },
        error: (err: any) => {
          // Handle Errors
          console.log(err);
        }
      });
    }
  }

  // Function to trigger a files data refresh
  refreshFolderData(): void {
    this.filesService.refreshFiles();
  }

  // Toggle Dropdown
  toggleAddFolder() {
    this.toggleAddFolderComponent.emit();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.relative');

    if (!clickedInside) {
      this.toggleAddFolder();
    }
  }
}
