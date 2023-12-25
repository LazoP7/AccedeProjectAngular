import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatchService } from '../Match/Models/match.service';
import { matchModel } from '../Match/Models/match.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CustomLocation } from '../Match/Models/location.model';
import { alreadyAuthenticatedGuard } from '../auth/guard/already-authenticated.guard';
import { UserInfo } from '../auth/login/models/UserInfo.model';
import { LocationService } from '../location/location.service';
import { Player } from '../Match/Models/player.model';


@Component({
    selector: 'app-column-sizebars',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit{

    markers: any [] = [];
    public matches : matchModel[] = []; 
    selectedLocationName: string = 'Any';
    public location? : CustomLocation;
    selectedDate: any;
    selectedLocationNameUpdated: string = 'Any';
    errorMessage: string = '';
    hasError: boolean = false;
    userId: number = 0;
    

    //Pagination options
    currentPage: number = 0; // Track the current page
    itemsPerPageOptions: number[] = [5, 10, 25, 100]; // Set the available items per page options
    itemsPerPage: number = 10; // Set the default number of items per page
    totalItems: number = 0; // Track the total number of items
    displayedMatches: matchModel[] = [];
    user!: UserInfo;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        private matchService: MatchService,
        private alreadyAuth: alreadyAuthenticatedGuard,
        private locationService: LocationService
        ) {}

    ngOnInit(): void {
        this.checkAuth();
        this.matchService.getAllMatches().subscribe(data => {this.matches = data,
            this.updateDisplayedMatches();
        });
        this.locationService.getAllLocations().subscribe(data => {this.Locations = data,
        this.Locations.unshift(this.LocationAny),
        this.addMarker();});
        
    }

      pageUpdate(event: any): void{
        if(this.currentPage != event.pageIndex){
            this.currentPage = event.pageIndex;
            // console.log(this.currentPage);
            this.updateDisplayedMatches();
        }
        if(this.itemsPerPage != event.pageSize){
            this.itemsPerPage = event.pageSize;
            // console.log(this.itemsPerPage);
            this.currentPage = 0; // Reset the current page to the first page
            this.updateDisplayedMatches();
        }
      }
      
      updateError(message: any){
        this.hasError = true;
        this.errorMessage = message;
      }

      updateDisplayedMatches(): void {
        this.totalItems = this.matches.length;
        // Calculate the index range of matches to be displayed based on the current page and items per page
        const startIndex = (this.currentPage) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        // console.log(startIndex, endIndex);
    
        // Update the displayed matches based on the calculated index range
        this.displayedMatches = this.matches.slice(startIndex, endIndex);
      }

    //mathods for google maps
        //method for adding markers to the google map
        addMarker() {
            for(let location of this.Locations){
                    // console.log(location.name)
                    this.straddress = location.address.split(",");
                    localStorage.setItem("straddress", JSON.stringify(this.straddress));
                    // console.log(this.straddress[0]);
                    // console.log(this.straddress[1]);
                    this.markers.push({position:{
                        lat: Number(this.straddress[0]),
                        lng: Number(this.straddress[1])                
                    },
                    title: location.name,
                    options: { animation: google.maps.Animation.DROP }
                    })
                
            }
        }
        //marker options
        markerOptions: google.maps.MarkerOptions = {clickable: true};

        //google map options : center of the map (center of Podgorica), zoom level and maptypecontrols
        mapOptions: google.maps.MapOptions = {
            center: {lat: 42.436502112813464,lng: 19.25725789179002 },
            zoom : 12,
            mapTypeControl: false,
            streetViewControl: false,
        }

    //current set of locations

    Locations: CustomLocation[] = []
    LocationAny : CustomLocation = {
        name: 'Any',
        address : ''
    }
    straddress : string[] = []

    setMatchLocation(matchLocation: string): void{
        this.selectedLocationName = matchLocation;
    }
    getMatchesByLocation(locationName:any): void {    
        this.matchService.getMatchesByLocation(locationName).subscribe(data => this.matches = data);
    }
    getMatchesByDate(date : string): void {
        this.matchService.getMatchesByDate(date).subscribe(data => this.matches = data);
    }

    //method for players joining matches
    joinMatch(match: matchModel): void {
        const auth = this.checkAuth();
        if(auth == true){
            if(match.players.length < match.num_of_players){
                this.matchService.joinMatch(this.user.id!, match.locationName.name, match.date.toString());
                if((match.players.some(player => player.username === this.user.username))==false){
                    match.players.push(this.user);
                }
            }
            else{
                this.updateError("This match is full");
            }
        }else{
            this.updateError("Please first log in or register to join this match");
        }
      }

      isUserInMatch(match: matchModel): boolean { 
        return match.players.some(player => player.username === this.user?.username);
      }

      toggleJoinLeave(match: matchModel): void {
        if (this.isUserInMatch(match)) {
          // If user is already in the match, leave it
          this.leaveMatch(match);
        } else {
          // If user is not in the match, join it
          this.joinMatch(match);
        }
      }

      leaveMatch(match: matchModel): void {
        this.kickPlayer(this.user, match);
      }

    //team captain controlls
    setMatchSize(size: number, match: matchModel): void {
        match.num_of_players = size;
        this.matchService.setNumOfPlayers(size, match.id);
    }
    kickPlayer(player: Player, match: matchModel): void {
        match.players = match.players.filter(p => p.username !== player.username);
        this.matchService.kickPlayer(match.locationName.name, match.date.toString(), player.username);
    }
      
    closeNotify(): void {
        this.hasError = false;
        this.errorMessage = '';
    }
      

    checkAuth(): boolean{
        const isAuthenticated = this.alreadyAuth.canActivate();
        
        if (!isAuthenticated) {
          this.errorMessage = 'Please first sign in or register an account';
          this.hasError = true;
          return false;
        } else {
          const userString = localStorage.getItem('User');
          if (userString != '' && userString) {
            this.user = JSON.parse(userString);
            console.log(isAuthenticated)
            return true;
          } else {
            // console.error('User not found in localStorage');
            return false;
          }
        }
    }
      

    //getting matches by clicking on a map marker
    openLocationTT(markerTitle: any) {
        this.selectedLocationName = markerTitle;
        this.getMatchesByLocation(this.selectedLocationName);
        
    }

    //method for setting maximum allowed selectable date
    maxDate(){
        var today = new Date();
        today.setDate(today.getDate()+7);
        var dd = today.getDate().toString();
        var mm = (today.getMonth()+1).toString();
        var year = today.getFullYear().toString();

        if(today.getDate() < 10){
            dd = '0' + dd;//adding the 0 in front of single digit days for max and min date ask for dd for days
        }
        if(today.getMonth() < 10){
            mm = '0' + mm;//adding the 0 in front of single digit days for max and min date ask for mm for months
        }
        if(today.getMonth() == 11 && today.getDate() > 23){
            mm = '00';//if I would pass into next year when adding 7 days for max selectable date month would be turned into 00(january)
        }
        return year + '-' + mm + '-' + dd;
    }
    //method for setting minimum allowed selectable date it being the current date
    minDate(){
        var today = new Date();
        var dd = today.getDate().toString();
        var mm = (today.getMonth()).toString();
        var year = today.getFullYear().toString();

        if(today.getDate() < 10){
            dd = '0' + dd; //adding the 0 in front of single digit days for max and min date ask for dd for days
        }
        if(today.getMonth() < 10){
            mm = '0' + mm; //adding the 0 in front of single digit days for max and min date ask for mm for months
        }
        if(today.getMonth() == 11 && today.getDate() > 23){
            mm = '00';//if I would pass into next year when adding 7 days for max selectable date month would be turned into 00(january)
        }
        return year + '-' + mm + '-' + dd;

    }

    //general SearchBy method for 3 different situations, when we have selected location but not a date, when we have selected date
    // but not location and when we have selected both

    SearchBy(){
        var extractedDate = (document.getElementById("dateTable") as HTMLInputElement).value; //extracting value from input date
        var stringDate = extractedDate.toString(); //turning that date format into a string
        var arrStrDate = stringDate.split("-");//spliting the date into year, month,day
        var day = arrStrDate[2];//setting day
        //searching by Location when date is null and location is different than any
        if(day == null && this.selectedLocationName != 'Any'){
            this.matchService.getMatchesByLocation(this.selectedLocationName).subscribe(data => {this.matches = data,
                this.updateDisplayedMatches();
            });
        }
        //searching for all matches
        if(day == null && this.selectedLocationName == 'Any'){
            this.matchService.getAllMatches().subscribe(data => {this.matches = data,
                this.updateDisplayedMatches();
            });
        } 
        //search by date specified when location is Any location
        if(day !=null && this.selectedLocationName == 'Any'){
            this.matchService.getMatchesByDate(extractedDate).subscribe(data => {this.matches = data,
                this.updateDisplayedMatches();
            });
        }
        //searching by date and location when they have been both specified
        if(day != null && this.selectedLocationName != 'Any'){
            this.matchService.getMatchesByLocationAndDate(this.selectedLocationName, extractedDate).subscribe(data => {this.matches = data,
                this.updateDisplayedMatches();
            });
        this.selectedLocationNameUpdated = this.selectedLocationName;
        this.currentPage = 0;
    }
    

    
}
}


