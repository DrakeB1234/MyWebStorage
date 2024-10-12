import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilesService } from '../../services/files.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-addfilesform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addfilesform.component.html',
})
export class AddfilesformComponent {
  @Output() closeForm = new EventEmitter<void>();

  filesService = inject(FilesService);
  form: FormGroup;
  errorMessage: string[] = [];
  formLoading: boolean = false;
  uploadedFileCount: number = 0;
  
  constructor() {
    // Initialize the form group and its controls
    this.form = new FormGroup({
      files: new FormControl([], [Validators.required, Validators.minLength(1)])
    });
  }

  // Getters for form validation
  get files() {
    return this.form.get('files');
  }

  onFileSelect(event: any) {
    // Get the selected files from the event
    this.form.value.files = Array.from(event.target.files);
  }

  async onSubmit() {
    if (this.form.valid) {

      let formData = new FormData();
      // Get current path
      formData.append('uploadPath', this.filesService.currentPath);

      // Reset error messages and file count to show in UI
      this.errorMessage = [];
      this.uploadedFileCount = 0;

      // Add loading attr to disable submit button and loading symbol
      this.formLoading = true;

      // Iterate over every file in form, make separate req for each to keep track of upload progress
      for (let data of this.form.value.files) {
        // Create a temp formdata to add file into
        let tempFormData = formData;
        tempFormData.set('file', data);

        try {
          const response = await firstValueFrom(this.filesService.addFile(tempFormData));
          // Subtract count from waiting files
          this.uploadedFileCount++;

        } catch (error: any) {
          // Subtract count from waiting files
          this.uploadedFileCount++;

          // Append error message
          this.errorMessage.push(error.error.message);
        }
      }

      // Close form and stop loading
      this.formLoading = false;
      // Refresh files data
      this.filesService.refreshFiles();

      // If no errors, then toggle container, otherwise keep open to show errors
      if (this.errorMessage.length < 1) this.closeForm.emit();
    }
    else {
      this.form.markAllAsTouched();
      this.formLoading = false;
    }
  }

  onCancelForm() {
    this.closeForm.emit();
  }
}
