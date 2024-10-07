import { Component, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilesService } from '../services/files.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

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
  errorMessage: string[] = [];
  uploadedFilesCount: number = 0;
  uploadedFilesCurrCount: number = 0;
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
  async submitFiles() {

    if (this.filesForm.valid) {

      let formData = new FormData();
      // Get current path
      formData.append('uploadPath', this.filesService.currentPath);

      // Reset error messages and file count to show in UI
      this.errorMessage = [];
      this.uploadedFilesCount = this.selectedFiles.length;
      this.uploadedFilesCurrCount = 0;

      // Add loading attr to disable submit button and loading symbol
      this.postFilesLoading = true;

      // Iterate over every file in form, make separate req for each to keep track of upload progress
      for (let data of this.selectedFiles) {
        // Create a temp formdata to add file into
        let tempFormData = formData;
        tempFormData.set('file', data);

        try {
          const response = await firstValueFrom(this.filesService.addFile(tempFormData));
          // Subtract count from waiting files
          this.uploadedFilesCurrCount++;

        } catch (error: any) {
          // Subtract count from waiting files
          this.uploadedFilesCurrCount++;

          // Append error message
          this.errorMessage.push(error.error.message);
        }
      }

      // Close form and stop loading
      this.postFilesLoading = false;
      // Refresh files data
      this.refreshFilesData();

      // If no errors, then toggle container, otherwise keep open to show errors
      if (this.errorMessage.length < 1) this.toggleAddFiles();
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

    if (!clickedInside && !this.postFilesLoading) {
      this.toggleAddFiles();
    }
  }
}
