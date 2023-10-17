import { Component, OnInit, ViewChild } from '@angular/core';
import {MapMarker, MapMarkerClusterer} from '@angular/google-maps';
import { MatchService } from '../Match/Models/match.service';
import { matchModel } from '../Match/Models/match.model';
import { LoginService } from '../auth/login.service';
import { LoginComponent } from '../auth/login/login.component';
import { Player } from '../Match/Models/player.model';
import { CustomLocation } from '../Match/Models/location.model';


@Component({
    selector: 'app-column-sizebars',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit{

    public matches : matchModel[] = []; 

    public location? : CustomLocation;

    public player!: { name: "Marko"; surname: "Markovic"; username: "MMarko"; reputation: 0; };

    constructor(
        private matchService: MatchService,
        private loginService: LoginService,
        ) {}

    ngOnInit(): void {
        this.addMarker();

        this.matchService.getAllMatches().subscribe(data => this.matches = data);
        
    }

    markers: any [] = [];

        addMarker() {
          this.markers.push({
            position: {
              lat: 42.446253039715536,
              lng: 19.242454104910678,
            },
            title: 'Štampar Sports Centre',
            options: { animation: google.maps.Animation.DROP },
          },{
            position: {
                lat: 42.44752912299903,
                lng: 19.26436708957756
            },
            title: 'Gimnazija Balon Sala',
            options: { animation: google.maps.Animation.DROP },
          });
        }

    Locations: any[] = [
        {name:'Any'},
        {name:'Štampar Sports Centre'},
        {name:'Gimnazija Balon Sala'}
    ]

    selectedLocationName: string = 'Any';


    currentlySelected(locationName:any): void {    
        this.matchService.getMatchesByLocation(locationName).subscribe(data => this.matches = data);
    }


    mapOptions: google.maps.MapOptions = {
        center: {lat: 42.436502112813464,lng: 19.25725789179002 },
        zoom : 12,
        mapTypeControl: false,
        
    }
    
    markerOptions: google.maps.MarkerOptions = {clickable: true};


    joinMatch(match : matchModel){
        // user = this.userService.getUser();
        // matchService.addPlayer(user)
        
        match.players.push(this.player);

    }

   


    openLocationTT(markerTitle: any) {
        this.selectedLocationName = markerTitle;
        this.currentlySelected(this.selectedLocationName);
        
    }

    maxDate(){
        let maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 7);
        maxDate.setMonth(maxDate.getMonth() + 1);
        if(maxDate.getUTCDate() < 10){
            var newDay = "0" + maxDate.getDate().toString();
        }
        else{
            var newDay = maxDate.getDate().toString();
        }
        if(maxDate.getUTCMonth() < 10){
            var newMonth = "0" + maxDate.getUTCMonth().toString();
        }
        else{
            var newMonth = maxDate.getUTCMonth().toString();
        }
        console.log(maxDate.getUTCFullYear().toString() + '-' + newMonth + '-' + newDay)
        return maxDate.getUTCFullYear().toString() + '-' + newMonth + '-' + newDay;
    }
    
    minDate(){
        let maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 1);
        if(maxDate.getUTCDate() < 10){
            var newDay = "0" + maxDate.getDate().toString();
        }
        else{
            var newDay = maxDate.getDate().toString();
        }
        if(maxDate.getUTCMonth() < 10){
            var newMonth = "0" + maxDate.getUTCMonth().toString();
        }
        else{
            var newMonth = maxDate.getUTCMonth().toString();
        }
        console.log(maxDate.getUTCFullYear().toString() + '-' + newMonth + '-' + newDay)
        return maxDate.getUTCFullYear().toString() + '-' + newMonth + '-' + newDay;

    }


    

    
}



