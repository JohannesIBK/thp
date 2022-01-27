import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtRefreshInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  addAuthHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.authService.token;
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: token,
        },
      });
    }
    return request;
  }

  handleResponseError(error: HttpResponse<unknown>, request: HttpRequest<unknown>, next: HttpHandler) {
    const validToken = error.headers?.get("X-Access-Token");

    if (error.status === 401 && validToken) {
      this.authService.token = validToken;

      request = this.addAuthHeader(request);
      return next.handle(request);
    }

    return throwError(() => error);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    // Handle response
    return next.handle(request).pipe(
      catchError((error) => {
        return this.handleResponseError(error, request, next);
      }),
    );
  }
}
