import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';

// Define routes
export const routes: Routes = [
  { path: 'signin', 
    component: SigninComponent
  },
  { path: '', 
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  // Wildcard route for handling 404 not found
  { path: '**', redirectTo: '' },
];
