import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { matchModel } from "./match.model";
import { Observable } from "rxjs";
import { environment } from "src/app/environments/environment.development";

@Injectable({providedIn: 'root'})
export class MatchService{

    constructor(private httpClient: HttpClient){}

    private url = environment.matchUrl;

    changeMatchType(type: number) //method to change match type in localStorage
    {
        localStorage.setItem("matchType", JSON.stringify(type));
    }

    getMatchType(): number //method to get match type from localStorage
    {
        return parseInt(localStorage.getItem("matchType")!);
    }

    getAllMatches() : Observable<matchModel[]> //http request to get all matches based on match type
    {
        const type = this.getMatchType()
        const options = {
            headers: this.generateHeader(),
            params: {
                type: type
            }
        }
        console.log(options.params.type);
        return this.httpClient.get<matchModel[]>(`${this.url}/getMatchesByType`, options);
    }

    getMatchesByLocation(locationName: string): Observable<matchModel[]> //http request to get matches based on location and type
    {
        const type = this.getMatchType()
        const options = {
          headers: this.generateHeader(),
          params: {locationName: locationName, type: type}
        };
      
        return this.httpClient.get<matchModel[]>(`${this.url}/location`, options);
      }

    getMatchesByDate(date: string): Observable<matchModel[]> //http request to get matches based on date and type
    {
        const type = this.getMatchType()
        let arrDate = date.split("-"); //string array where date is split into year, month, day, hour, minute, second
        let year: number = +arrDate[0]; 
        let month: number = +arrDate[1];
        let day: number = +arrDate[2];

        const options = {
            headers : this.generateHeader(),
            params: { year: year, month: month, day: day, type: type}
        }

        return this.httpClient.get<matchModel[]>(`${this.url}/date`, options);

    }  

    getMatchesByLocationAndDate(selectedLocationName : string, selectedDate : string): Observable<matchModel[]> 
    //http request to get matches based on location and precise date
    {
        const type = this.getMatchType()
        let arrDate = selectedDate.split("-"); //string array where date is split into year, month, day, hour, minute, second
        let year: number = +arrDate[0];
        let month: number = +arrDate[1];
        let day: number = +arrDate[2];
        const options = {
            headers: this.generateHeader(),
            params: { locationName: selectedLocationName, year: year, month: month, day: day, type: type} 
        }
        return this.httpClient.get<matchModel[]>(`${this.url}/locationANDdate`, options);
    }
      

    getMyMatches(username: string) : Observable<matchModel[]> //http reqeust to get matches for provided user
    {
        const options = {
            headers : this.generateHeader(),
            params: { username: username}
        }
        return this.httpClient.get<matchModel[]>(`${this.url}/myMatches`, options);

    }


    joinMatch(userId: number, locationName: string, date: string): void //http request to add user to match players
    {
        const type = this.getMatchType()
        const params = new HttpParams()
            .set('userId', userId)
            .set('locationName', locationName)
            .set('date', date)
            .set('type', type);
        this.httpClient.put(`${this.url}/player`, null, {headers: this.generateHeader(), params })
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


    setNumOfPlayers(size: number, matchId: number): void //http request to change maximum number of players in a match
    {
        const type = this.getMatchType()
        const params = new HttpParams()
        .set('size', size)
        .set('matchId', matchId)
        .set('type', type);
        this.httpClient.put(`${this.url}/setNumOfPlayers`,null, {headers: this.generateHeader(), params })
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

    generateHeader(): HttpHeaders //generate header for http requests
    {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }
    
    changeMatchStatus(locationName: string, date: string) //http request to change status of the match. Either Closed or Open
    {
        const type = this.getMatchType()
        const params = new HttpParams()
        .set('locationName', locationName)
        .set('date', date)
        .set("type", type);
        this.httpClient.put(`${this.url}/changeMatchStatus`, null, { headers: this.generateHeader(), params })
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

    kickPlayer(locationName: string, date: string, playerUsername: string) //http request to remove user from match players
    {
        const type = this.getMatchType()
        const params = new HttpParams()
        .set('locationName', locationName)
        .set('date', date)
        .set('playerUsername', playerUsername)
        .set('type', type);
        this.httpClient.put(`${this.url}/kickPlayer`, null, { headers: this.generateHeader(), params })
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