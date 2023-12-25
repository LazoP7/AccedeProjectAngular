import { Injectable } from "@angular/core";
import { environment } from "../environments/environment.development";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { UserInfo } from "../auth/login/models/UserInfo.model";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService{

    constructor(private httpClient: HttpClient){}

    private url = environment.userUrl;

    getUser(username:string): Observable<UserInfo>{
        const options = {
            headers: this.generateHeader(),
            params: {
                username: username
            }
        }
        return this.httpClient.get<UserInfo>(`${this.url}/search-by-username`, options);
    }

    generateHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }

    updateProfDesc(desc : string, userId: number): void{
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

    updateUserRoles(userId: number, roles: string){
        const params = new HttpParams()
        .set('userId', userId)
        .set('userRoles', roles)
        console.log(roles);
        this.httpClient.put(`${this.url}/roles`, null, { headers: this.generateHeader(), params })
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

    checkRoles(username: string): Observable<any>{
        const options = {
            headers : this.generateHeader(),
            params: { username: username}
        }
        console.log(options.params);
        return this.httpClient.get(`${this.url}/checkRoles`, options)
    }

    addReputation(username: string):any {
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