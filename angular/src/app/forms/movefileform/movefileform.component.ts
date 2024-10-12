import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FolderData } from '../../../Models/folderdata.model';
import { firstValueFrom } from 'rxjs';
import { MoveFile } from '../../../Models/movefile.model';

@Component({
  selector: 'app-movefileform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './movefileform.component.html',
})
export class MovefileformComponent implements OnInit {
  @Input() file: any[] | null = [];
  @Output() formSubmit = new EventEmitter<void>();
  @Output() closeForm = new EventEmitter<void>();

  filesService = inject(FilesService);
  form: FormGroup;
  errorMessage: string[] = [];
  formLoading: boolean = false;
  foldersData: FolderData[] = [];
  
  constructor() {
    // Initialize the form group and its controls
    this.form = new FormGroup({
      fileDestination: new FormControl("")
    });
  }

  ngOnInit(): void {
    this.filesService.getAllFolders().subscribe({
      next: (data: FolderData[]) => {
        this.foldersData = data;
      }
    })
  }

  // Getters for form validation
  get fileDestination() {
    return this.form.get('fileDestination');
  }

  async onSubmit() {
    if (this.form.valid && this.file) {
      // Reset error messages and file count to show in UI
      this.errorMessage = [];

      // Add loading attr to disable submit button and loading symbol
      this.formLoading = true;

      let fileDestination = this.form.value.fileDestination;
      
      // Iterate over every file in form, make separate req for each to keep track of upload progress
      this.file.forEach(async (e: any) => {
        const formData = { 
          FileName: e.fileName, 
          FilePath: e.fileDirectoryName,
          FileDestination: fileDestination
        } as MoveFile;
        
        try {
          const data = await firstValueFrom(this.filesService.moveFile(formData));
        } catch (error: any) {
          // Append error message
          this.errorMessage.push(error.error.message);
        }
      });

      this.formSubmit.emit();

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
