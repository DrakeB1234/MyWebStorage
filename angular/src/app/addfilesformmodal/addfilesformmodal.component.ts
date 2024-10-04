import { Component, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilesService } from '../services/files.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addfilesformmodal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addfilesformmodal.component.html',
})
export class AddfilesformmodalComponent {
  filesService = inject(FilesService);

  filesForm: FormGroup;
  selectedFiles: File[] = [];
  postFilesLoading: boolean = false;
  errorMessage: string = "";
  errorMessageSuccessfulFiles: string[] = [];
  currentPath: string = this.filesService.getCurrentPath();

  constructor() {
    // Initialize the form group and its controls
    this.filesForm = new FormGroup({
      files: new FormControl(null, [Validators.required])
    });
  }
  
  @Output() toggleAddFilesComponent = new EventEmitter<void>();

  // Form Handler

  // Function to handle file selection
  onFileSelect(event: any) {
    // Get the selected files from the event
    this.selectedFiles = Array.from(event.target.files);
    this.filesForm.patchValue({
      files: this.selectedFiles
    });
  }

  // Submit File Function
  submitFiles() {

    let formData = new FormData();
    // Get current path
    formData.append('uploadPath', this.filesService.currentPath);

    // Append each file to form data
    this.selectedFiles.forEach(e => {
      formData.append('files', e);
    });

    // Reset error messages
    this.errorMessage = "";
    this.errorMessageSuccessfulFiles = [];

    // Add loading attr to disable submit button and loading symbol
    this.postFilesLoading = true;
    
    if (this.filesForm.valid) {
      this.filesService.postFiles(formData).subscribe({
        next: (data: any) => {
          // Close form and stop loading
          this.postFilesLoading = false;
          this.toggleAddFiles();
          // Refresh files data
          this.refreshFilesData();
        },
        error: (err: any) => {
          // Handle Errors
          this.postFilesLoading = false;

          // Set error message and display files that were successfully uploaded
          this.errorMessage = err.error.message;
          this.errorMessageSuccessfulFiles = err.error.successfulFiles;
        }
      });
    }
    else {
      this.postFilesLoading = false;
    }
  }

  // Function to trigger a files data refresh
  refreshFilesData(): void {
    this.filesService.refreshFiles();
  }

  // Toggle Dropdown
  toggleAddFiles() {
    this.toggleAddFilesComponent.emit();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.relative');

    if (!clickedInside) {
      this.toggleAddFiles();
    }
  }
}
