import { Component, Output, EventEmitter, HostListener, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilesService } from '../files.service';

@Component({
  selector: 'app-addfilesformmodal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './addfilesformmodal.component.html',
})
export class AddfilesformmodalComponent {
  filesService = inject(FilesService);

  filesForm: FormGroup;
  selectedFiles: File[] = [];

  constructor() {
    // Initialize the form group and its controls
    this.filesForm = new FormGroup({
      files: new FormControl(null, [Validators.required])
    });
  }
  
  @Output() toggleAddFilesComponent = new EventEmitter<void>();
  @Output() refreshFileData = new EventEmitter<void>();

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
    formData.append('uploadPath', 'a');

    // Append each file to form data
    this.selectedFiles.forEach(e => {
      formData.append('files', e);
    });
    
    if (this.filesForm.valid) {
      this.filesService.postFiles(formData).subscribe({
        next: (data: any) => {
          // Handle successful post
          console.log(data);
          this.refreshFileData.emit();
        },
        error: (err: any) => {
          // Handle Errors
          console.log(err);
        }
      });
    }
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
      this.toggleAddFiles()
    }
  }
}
