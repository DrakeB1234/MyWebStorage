import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-renamefolderform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './renamefolderform.component.html',
})
export class RenamefolderformComponent {
  @Input() folderPath: string = "";
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
    this.errorMessage = [];
    if (this.form.valid && this.folderPath) {
      this.filesService.renameFolder({NewFolderName: this.form.value.folderName, FolderPath: this.folderPath}).subscribe({
        next: (data: any) => {
          // Expects newPath on res
          if (data.newPath) {
            this.filesService.currentPath = data.newPath;
            this.filesService.refreshAllData();
          }
          else {
            this.filesService.currentPath = "";
          }
          this.closeForm.emit();
        },
        error: (err: any) => {
          console.log(err)
          this.errorMessage.push(err.error.message);
        }
      })
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  onCancelForm() {
    this.closeForm.emit();
  }
}
