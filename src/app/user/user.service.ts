import { Injectable } from "@angular/core";
import { environment } from "../environments/environment.development";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { UserInfo } from "../auth/login/models/UserInfo.model";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService{

    constructor(private httpClient: HttpClient){}

    private url = environment.userUrl;

    getUser(username:string): Observable<UserInfo> //http request to get user based on username
    {
        const options = {
            headers: this.generateHeader(),
            params: {
                username: username
            }
        }
        return this.httpClient.get<UserInfo>(`${this.url}/search-by-username`, options);
    }

    generateHeader(): HttpHeaders //generate header for http requests
    {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }

    updateProfDesc(desc : string, userId: number): void //http request to update user profile description
    {
        const params = new HttpParams()
        .set('userId', userId)
        .set('profDescr', desc)
        console.log("called")
        this.httpClient.put(`${this.url}/updateDescr`, null, { headers: this.generateHeader(), params })
        .subscribe(
            (response) => {
                console.log('Success:', response);
                // Handle success response if needed
            },
            (error) => {
                console.error('Error:', error);
                // Handle error response if needed
            }
        );
    }

    updateUserRoles(userId: number, roles: string): Observable<any> //http request to update user roles
    {
        const params = new HttpParams()
        .set('userId', userId)
        .set('userRoles', roles)
        console.log(roles);
        return this.httpClient.put(`${this.url}/roles`, null, { headers: this.generateHeader(), params })
    }

    checkRoles(username: string): Observable<any> //http request to check user roles
    {
        const options = {
            headers : this.generateHeader(),
            params: { username: username}
        }
        console.log(options.params);
        return this.httpClient.get(`${this.url}/checkRoles`, options)
    }

    addReputation(username: string):any //http requet to add reputation to user
    {
        const params = new HttpParams()
        .set('username', username)
        this.httpClient.put(`${this.url}/addRep`, null, { headers: this.generateHeader(), params })
        .subscribe(
            (response) => {
                console.log('Success:', response);
                // Handle success response if needed
            },
            (error) => {
                console.error('Error:', error);
                // Handle error response if needed
            }
        );
    }
}