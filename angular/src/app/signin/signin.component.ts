import { Component, inject } from '@angular/core';
import { FilesService } from '../files.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sigin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  filesService = inject(FilesService);

  loginForm: FormGroup;
  loginLoading: boolean = false;
  errorMessage: string = "";

  constructor() {
    // Initialize the form group and its controls
    this.loginForm = new FormGroup({
      Username: new FormControl("", Validators.required),
      Password: new FormControl("", Validators.required)
    });
  }

  // Getters for form validation
  get Username() {
    return this.loginForm.get('Username');
  }

  get Password() {
    return this.loginForm.get('Password');
  }

  // Submit Login Function
  submitLogin() {

    // Add loading attr to disable submit button and loading symbol
    this.loginLoading = true;

    // Adding to empty form data, so api can read values
    let formData = new FormData();

    // Reset error messages
    this.errorMessage = "";
    
    // Ensures that folder data has a value set
    if (this.loginForm.valid) {
      formData.append('Username', this.loginForm.value.Username);
      formData.append('Password', this.loginForm.value.Password);
    }
    else {
      this.loginLoading = false;
      this.loginForm.markAllAsTouched();
    }
  }
}
