import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<any> | boolean {
    return this.authService.authenticateUser().pipe(
      tap((data: any) => {
        // If any data is returned from api, then user is authed
        return [true];
      }),
      catchError(() => {
        this.router.navigate(['/signin']);
        return [false];
      })
    );
  }
}