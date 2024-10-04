import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment.development';
import apiEndpoints from '../../../api-endpoints.json';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Constructs a platform ID to check if req is made on browser, which prevents errors in browser only
  // methods, such as 'localStorage'
  constructor(@Inject(PLATFORM_ID) private platformId: object, private router: Router) { }

  private http: HttpClient = inject(HttpClient);
  
  apiUrl: string = environment.apiUrl;
  apiEndpoints: typeof apiEndpoints = apiEndpoints;
  jwtTokenName: string = "MWS_MY_WEB_STORAGE_TOKEN";

  // Auth functions

  // Reaches api with login info from form, if data matches, then api returns token
  signIn(formData: any): Observable<any> {
    return this.http.post(this.apiUrl + apiEndpoints.signIn, formData);
  }

  // This function is useful in auth guards, as it communicates with api to check if user is
  // Authenticated before trying to access home page
  authenticateUser(): Observable<any> {
    return this.http.get(this.apiUrl + apiEndpoints.authenticate);
  }

  // Token functions
  setLocalToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.setItem(this.jwtTokenName, token);
    }
  }

  getLocalToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.jwtTokenName);
    }
    return null;
  }

  // Used for sign out function, possibly also when user fails to provide correct signin credentials
  deleteLocalToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.jwtTokenName);
      this.router.navigate(['/signin']);
    }
  }
}
