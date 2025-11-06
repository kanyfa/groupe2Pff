import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    console.log('AuthInterceptor - intercepting request:', req.url);
    console.log('Token present:', !!token);
    console.log('Request headers:', req.headers.keys());

    // Skip adding auth header for auth endpoints (login, register, signup, refresh)
    // and contact message endpoint (public endpoint)
    const authEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh'];
    const publicEndpoints = ['/api/messages/contact'];
    const isAuthEndpoint = authEndpoints.some(endpoint => req.url.includes(endpoint));
    const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

    if (token && !isAuthEndpoint && !isPublicEndpoint) {
      console.log('Adding Authorization header');
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error.status, error.message);
          if (error.status === 401) {
            console.log('401 error - logging out and redirecting to login');
            this.authService.logoutLocal();
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      );
    }

    console.log('No token or auth endpoint - proceeding without auth header');
    return next.handle(req);
  }
}
