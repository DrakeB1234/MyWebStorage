import { Component, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilesService } from '../services/files.service';
import { CommonModule } from '@angular/common';
import { FolderData } from '../../Models/folderdata.model';

@Component({
  selector: 'app-movefilemodal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movefilemodal.component.html',
})
export class MovefilemodalComponent implements OnInit {
  filesService = inject(FilesService);

  folderForm: FormGroup;
  postFolderLoading: boolean = false;
  errorMessage: string = "";
  currentPath: string = this.filesService.getCurrentPath();
  foldersData: FolderData[] = [];

  constructor() {
    // Initialize the form group and its controls
    this.folderForm = new FormGroup({
      FileDestination: new FormControl("")
    });
  }
  
  @Output() toggleMoveFile = new EventEmitter<void>();
  @Output() getMoveFilePath = new EventEmitter<string>();

  ngOnInit(): void {
    this.filesService.getAllFolders().subscribe({
      next: (data: FolderData[]) => {
        this.foldersData = data;
      }
    })
  }

  // Form Handler

  // Getters for form validation
  get FileDestination() {
    return this.folderForm.get('FileDestination');
  }

  // Submit Folder Function
  submitFolder() {

    // Add loading attr to disable submit button and loading symbol
    this.postFolderLoading = true;

    // Reset error messages
    this.errorMessage = "";
    
    // Ensures that folder data has a value set
    if (this.folderForm.valid) {
      
      this.getMoveFilePath.emit(this.folderForm.value.FileDestination);
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
  toggleMoveFileDropdown() {
    this.toggleMoveFile.emit();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.relative');

    if (!clickedInside) {
      this.toggleMoveFileDropdown();
    }
  }
}
