import { HttpClient, HttpContext, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/app/environments/environment.development";

@Injectable({providedIn : 'root'})
export class ValidationService {

    constructor(private httpClient : HttpClient) {}

    url = environment.userUrl;

    getUser(username : string): Observable<string> {
        return this.httpClient.get<any>(`${this.url}/search-by-username${username}`, { headers: this.generateHeader() });
    }

    generateHeader() : HttpHeaders {
        const headers = new HttpHeaders();
        headers.set('Accept', 'application/json');
        headers.set('Content-Type', 'application/json');
        headers.set('Acccess-Control-Allow-Origin', '*');
        return headers;
    }
}