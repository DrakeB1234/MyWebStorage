import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';

// Define routes
export const routes: Routes = [
  { path: 'signin', 
    component: SigninComponent 
  },
  { path: '', 
    component: HomeComponent 
  }
  // Wildcard route for 404 page
];
