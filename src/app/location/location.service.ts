import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment.development";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class LocationService{

    constructor(private httpClient: HttpClient){}
    url = environment.locationUrl;
    matchUrl = environment.matchUrl;

    generateHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }

    createLocation(location: any): Observable<any>{
        console.log('Location Payload:', location);
        return this.httpClient.post<any>(`${this.url}/newLocation`, location, {headers: this.generateHeader()});
    }

    populateLocation(location: string){
        const params = new HttpParams()
        .set('locationName', location)
        console.log(location)
        return this.httpClient.put<any>(`${this.matchUrl}/populate`, null, {headers: this.generateHeader(), params});
    }

    getAllLocations(): Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.url}/getAllLocations`, {headers: this.generateHeader()});
    }
}