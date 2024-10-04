import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  let authService = inject(AuthService);
  
  // First check if token has been set in localstorage, if not then header won't be added
  // Causing protected routes in api to return 401 error
  let token = authService.getLocalToken() 
  console.log(req)
  if (token) { 
    const clonedRequest = req.clone({
      headers: req.headers.set(
        'Authorization', `Bearer ${token}`
      )
    });

    return next(clonedRequest);
  } 
  else {
    // If no token, then don't add to header, causing api to return 401 on protected routes
    return next(req);
  };
}
