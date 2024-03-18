import { Component, ViewChild } from '@angular/core';
import { matchModel } from '../Match/Models/match.model';
import { MatPaginator } from '@angular/material/paginator';
import { UserInfo } from '../auth/login/models/UserInfo.model';
import { MatchService } from '../Match/Models/match.service';
import { Player } from '../Match/Models/player.model';

@Component({
    selector: 'app-owner',
    templateUrl: './owner.component.html',
    styleUrls: ['./owner.component.css']
})

export class OwnerComponent{

    currentPage: number = 0; // Track the current page
    itemsPerPageOptions: number[] = [5, 10, 25, 100]; // Set the available items per page options
    itemsPerPage: number = 10; // Set the default number of items per page
    totalItems: number = 0; // Track the total number of items
    matches: matchModel[] = [];
    locationName: string = "";
    user!: UserInfo;
    matchType: string = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator; //paginator for a list of matches
  
    constructor(
        private matchService: MatchService
        ) {}

        ngOnInit(): void {
            const userString = localStorage.getItem('User');
            if (userString) {
              this.user = JSON.parse(userString);
              this.locationName = this.user.username;
              this.matchService.getMatchesByLocation(this.locationName).subscribe(
                (data: matchModel[]) => {
                  this.matches = data;
                  this.loadType(data);
                });
            } else {
              console.error('User not found in localStorage');
            }
          }
       
    loadType(data: any) // load match type
    {
        const type = data[0].type;
        if(type == 0){
            this.matchType = 'Basketball'
        }
        if(type == 1){
            this.matchType = 'Football'
        } 
        if(type == 2) {
            this.matchType = 'Tennis'
        }
    }

    closeMatch(match : matchModel) //set match status to closed
    {
        match.open = false;
        this.matchService.changeMatchStatus(match.locationName.name, match.date.toString())
    }

    openMatch(match : matchModel) //set match status to open
    {
        match.open = true;
        this.matchService.changeMatchStatus(match.locationName.name, match.date.toString())
    }

    kickPlayer(match: matchModel, player: Player) //remove player from match
    {
        const index: number = match.players.indexOf(player); //get index of selected player from list of players
        match.players.splice(index, 1); //get player from list of players based on index of player
        this.matchService.kickPlayer(match.locationName.name, match.date.toString(), player.username) //call match service to kick player
    }

}