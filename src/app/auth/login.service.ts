import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment.development";
import { UserDTO } from "./login/models/user.model";
import { BehaviorSubject, Observable } from "rxjs";
import {JwtDTO} from "./login/models/jwt.model";

@Injectable({providedIn : 'root'})
export class LoginService {

    private httpClient: HttpClient;

    constructor( httpBackend: HttpBackend) { 
       this.httpClient = new HttpClient(httpBackend);
    }

    isAuth = new BehaviorSubject(false);
    url = environment.authUrl;
    userurl = environment.userUrl;


    getToken(user : UserDTO): Observable<JwtDTO> {
       return this.httpClient.post<any>(`${this.url}/signin`, user, {headers: this.generateHeader()})
    }

    generateHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }

    register(payload : any) : Observable<any> {
        return this.httpClient.post<any>(`${this.userurl}/createUser`, payload, {headers:  this.generateHeader()})
    }

}