// src/app/interceptors/language.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Clone the request to add the new header
    const modifiedReq = req.clone({
      headers: req.headers.set('Accept-Language', 'en') // Add the language code here
    });

    // Pass on the modified request
    return next.handle(modifiedReq);
  }
}
