import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sigin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  title = "My Web Storage | Login";

  authService = inject(AuthService);
  showPassword: boolean = false;

  loginForm: FormGroup;
  signInLoading: boolean = false;
  errorMessage: string = "";

  constructor(private router: Router) {
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
    this.signInLoading = true;

    // Adding to empty form data, so api can read values
    let formData = new FormData();

    // Reset error messages
    this.errorMessage = "";
    
    // Ensures that folder data has a value set
    if (this.loginForm.valid) {
      formData.append('Username', this.loginForm.value.Username);
      formData.append('Password', this.loginForm.value.Password);

      this.authService.signIn(formData).subscribe({
        next: (data: any) => {
          // stop loading and navigate to home
          this.signInLoading = false;
          
          // Handle token
          if (data.token) {
            this.authService.setLocalToken(data.token);
            this.router.navigate(['']);
          }
          else {
            this.errorMessage = "Failed to generate token, try again later";
          }
        },
        error: (err: any) => {
          // Handle Errors
          this.signInLoading = false;
          // Set error message and display files that were successfully uploaded
          this.errorMessage = err.error.message;
          // Checks if status was 0, which is a failure to connect
          if (err.status === 0) {
            this.errorMessage = "Failed to connect to MyWebStorage";
          }
        }
      });
    }
    else {
      this.signInLoading = false;
      this.loginForm.markAllAsTouched();
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
