import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilesService } from '../files.service';
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
  postFolderLoading: boolean = false;
  errorMessage: string = "";
  currentPath: string = this.filesService.getCurrentPath();

  constructor() {
    // Initialize the form group and its controls
    this.folderForm = new FormGroup({
      FolderName: new FormControl("", [Validators.required])
    });
  }
  
  @Output() toggleAddFolderComponent = new EventEmitter<void>();

  // Form Handler

  // Getters for form validation
  get FolderName() {
    return this.folderForm.get('FolderName');
  }

  // Submit Folder Function
  submitFolder() {

    // Add loading attr to disable submit button and loading symbol
    this.postFolderLoading = true;

    // Adding to empty form data, so api can read values
    let formData = new FormData();

    // Reset error messages
    this.errorMessage = "";
    
    // Ensures that folder data has a value set
    if (this.folderForm.valid) {
      formData.append('FolderName', this.folderForm.value.FolderName);
      formData.append('FolderPath', this.filesService.currentPath);

      this.filesService.postFolder(formData).subscribe({
        next: (data: any) => {
          // Close form and stop loading
          this.postFolderLoading = false;
          this.toggleAddFolder();
          // Refresh files data
          this.refreshFolderData();
        },
        error: (err: any) => {
          // Handle Errors
          this.postFolderLoading = false;
          this.errorMessage = err.error.message;
        }
      });
    }
    else {
      this.postFolderLoading = false;
    }
  }

  // Function to trigger a files data refresh
  refreshFolderData(): void {
    this.filesService.refreshFolders();
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
