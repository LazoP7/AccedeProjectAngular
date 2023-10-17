import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class HttpGeneralInterceptor implements HttpInterceptor {

    tokenRead = localStorage.getItem('jwtToken');

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('SkipToken') === 'true') {
            const newHeaders = req.headers.delete('SkipToken')
            const newRequest = req.clone({ headers: newHeaders });
            return next.handle(newRequest);
          } else {
            const newRequest = req.clone({ setHeaders: { 'Authorization': 'Token Bearer' } });
            return next.handle(newRequest);
          }
    }
}

export const HttpInterceptorProvider = [{provide: HTTP_INTERCEPTORS, useValue: HttpGeneralInterceptor, multi: true}]