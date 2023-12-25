import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { matchModel } from "./match.model";
import { Observable } from "rxjs";
import { environment } from "src/app/environments/environment.development";

@Injectable({providedIn: 'root'})
export class MatchService{

    constructor(private httpClient: HttpClient){}

    private url = environment.matchUrl;

    getAllMatches() : Observable<matchModel[]>{
        const options = {
            headers: this.generateHeader(),
            params: {
                
            }
        }
        return this.httpClient.get<matchModel[]>(`${this.url}/allMatches`, options);
    }

    getMatchesByLocation(locationName: string): Observable<matchModel[]> {
        const options = {
          headers: this.generateHeader(),
          params: {locationName: locationName}
        };
      
        return this.httpClient.get<matchModel[]>(`${this.url}/location`, options);
      }

    getMatchesByDate(date: string): Observable<matchModel[]> {
        let arrDate = date.split("-");
        let year: number = +arrDate[0];
        let month: number = +arrDate[1];
        let day: number = +arrDate[2];

        const options = {
            headers : this.generateHeader(),
            params: { year: year, month: month, day: day}
        }

        return this.httpClient.get<matchModel[]>(`${this.url}/date`, options);

    }  

    getMatchesByLocationAndDate(selectedLocationName : string, selectedDate : string): Observable<matchModel[]> {
        let arrDate = selectedDate.split("-");
        let year: number = +arrDate[0];
        let month: number = +arrDate[1];
        let day: number = +arrDate[2];
        const options = {
            headers: this.generateHeader(),
            params: { locationName: selectedLocationName, year: year, month: month, day: day} 
        }
        return this.httpClient.get<matchModel[]>(`${this.url}/locationANDdate`, options);
    }
      

    getMyMatches(username: string) : Observable<matchModel[]>{
        const options = {
            headers : this.generateHeader(),
            params: { username: username}
        }
        return this.httpClient.get<matchModel[]>(`${this.url}/myMatches`, options);

    }


joinMatch(userId: number, locationName: string, date: string): void {
    const params = new HttpParams()
        .set('userId', userId)
        .set('locationName', locationName)
        .set('date', date);

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


    setNumOfPlayers(size: number, matchId: number): void {
        const params = new HttpParams()
        .set('size', size)
        .set('matchId', matchId);
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

    generateHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/json');
        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }
    
    changeMatchStatus(locationName: string, date: string){
        const params = new HttpParams()
        .set('locationName', locationName)
        .set('date', date);
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

    kickPlayer(locationName: string, date: string, playerUsername: string){
        const params = new HttpParams()
        .set('locationName', locationName)
        .set('date', date)
        .set('playerUsername', playerUsername);
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