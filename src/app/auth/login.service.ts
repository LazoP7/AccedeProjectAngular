import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment.development";
import { UserDTO } from "./login/models/user.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({providedIn : 'root'})
export class LoginService {

    private httpClient: HttpClient;

    constructor( httpBackend: HttpBackend) { 
       this.httpClient = new HttpClient(httpBackend);
    }

    subject = new BehaviorSubject(false);

    url = environment.authUrl;


    getToken(user : UserDTO): Observable<any> {
       return this.httpClient.post<any>(`${this.url}/signin`, user, {headers: this.generateHeader()})
    }

    generateHeader() : HttpHeaders {
        const headers = new HttpHeaders();
        headers.set('Accept', 'application/json');
        headers.set('Content-Type', 'application/json');
        return headers;
    }

    register(payload : any) : Observable<any> {
        return this.httpClient.post<any>(`${this.url}/createUser`, payload, {headers:  this.generateHeader()})
    }

}