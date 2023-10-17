import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { matchModel } from "./match.model";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class MatchService{

    constructor(private httpClient: HttpClient){}

    private url = './assets/fakeBackendInfo/'
    private selLoc : any;

    getAllMatches() : Observable<any>{
        // return this.httpClient.get<matchModel[]>(this.url, {headers: this.generateHeader()});
        
        return this.httpClient.get<matchModel[]>('./assets/fakeBackendInfo/allMatches.json');
    }

    getMatchesByLocation(locationName : any) : Observable<any>{

        if(locationName == 'Štampar Sports Centre'){
            this.selLoc = 'stamparMatches.json'
        }
        if(locationName == 'Gimnazija Balon Sala'){
            this.selLoc = 'gimnazijaMatches.json'
        }
        if(locationName == 'Any'){
            this.selLoc = 'allMatches.json'
        }

        return this.httpClient.get<matchModel[]>(`${this.url}/${this.selLoc}`)
    }

    getMyMatches() : Observable<any>{
        return this.httpClient.get<matchModel[]>('./assets/fakeBackendInfo/myMatches.json');

    }

    generateHeader() : HttpHeaders {
        const headers = new HttpHeaders();
        headers.set('Accept', 'application/json')
        return headers;
    }

}