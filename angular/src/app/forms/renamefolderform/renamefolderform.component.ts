import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-renamefolderform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './renamefolderform.component.html',
})
export class RenamefolderformComponent {
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
    if (this.form.valid) {
      console.log(this.form.value);
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  onCancelForm() {
    this.closeForm.emit();
  }
}
