// ─────────────────────────────────────────────────────────────────────────────
// jwt.interceptor.ts  (JwtInterceptor)
// An HTTP interceptor that automatically adds the JWT token to every outgoing
// HTTP request as an Authorization header.
//
// This means components never need to manually add the header themselves —
// every call made with HttpClient gets the token attached here transparently.
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

// Note: @Injectable() without providedIn — this class is registered manually
// in AppModule using the HTTP_INTERCEPTORS token.
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  // intercept() is called for every outgoing HTTP request.
  // 'request' is the original request; 'next' passes it down the chain.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      // request objects are immutable, so we create a modified clone.
      // setHeaders merges the new header into whatever headers already exist.
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`  // Standard JWT header format.
        }
      });
    }

    // Pass the (possibly modified) request on to the next handler.
    return next.handle(request);
  }
}
