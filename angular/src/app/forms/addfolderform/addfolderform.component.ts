import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addfolderform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './addfolderform.component.html',
})
export class AddfolderformComponent {
  @Output() closeForm = new EventEmitter<void>();

  filesService = inject(FilesService);
  form: FormGroup;
  errorMessage: string[] = [];
  formLoading: boolean = false;
  
  constructor() {
    // Initialize the form group and its controls
    this.form = new FormGroup({
      folderName: new FormControl("", [Validators.required])
    });
  }

  // Getters for form validation
  get folderName() {
    return this.form.get('folderName');
  }

  onSubmit() {
    // Add loading attr to disable submit button and loading symbol
    this.formLoading = true;

    // Adding to empty form data, so api can read values
    let formData = new FormData();

    // Reset error messages
    this.errorMessage = [];
    
    // Ensures that folder data has a value set
    if (this.form.valid) {
      formData.append('FolderName', this.form.value.folderName);
      formData.append('FolderPath', this.filesService.currentPath);

      this.filesService.postFolder(formData).subscribe({
        next: (data: any) => {
          // Close form and stop loading
          this.formLoading = false;
          // Refresh files data
          this.filesService.refreshFolders();
          this.closeForm.emit();
        },
        error: (err: any) => {
          // Handle Errors
          this.formLoading = false;
          this.errorMessage.push(err.error.message);
        }
      });
    }
    else {
      this.formLoading = false;
    }
  }

  onCancelForm() {
    this.closeForm.emit();
  }
}
