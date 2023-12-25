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

    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
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
                });
            } else {
              console.error('User not found in localStorage');
            }
          }
          

    closeMatch(match : matchModel){
        match.open = false;
        this.matchService.changeMatchStatus(match.locationName.name, match.date.toString())
    }

    openMatch(match : matchModel){
        match.open = true;
        this.matchService.changeMatchStatus(match.locationName.name, match.date.toString())
    }

    kickPlayer(match: matchModel, player: Player){
        const index: number = match.players.indexOf(player);
        match.players.splice(index, 1);
        this.matchService.kickPlayer(match.locationName.name, match.date.toString(), player.username)
    }

}