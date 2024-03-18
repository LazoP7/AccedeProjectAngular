import { Component } from '@angular/core';
import { matchModel } from '../Match/Models/match.model';
import { MatchService } from '../Match/Models/match.service';
import { UserInfo } from '../auth/login/models/UserInfo.model';
import { UserService } from '../user/user.service';
import { Player } from '../Match/Models/player.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  public matches : matchModel[] = [];
  public user!: UserInfo;
  public name!: string;
  public surname!: string;
  public username!: string;
  public description!: string;
  public reputation!: number;

  constructor(private matchService: MatchService,
    private userService: UserService) {}



  ngOnInit(): void {

    const storedUser = localStorage.getItem('User');

    if (storedUser !== null) {
      this.user = JSON.parse(storedUser) as UserInfo;
      this.name = this.user.name;
      this.surname = this.user.surname;
      this.username = this.user.username;
      this.description = this.user.profDescr;
      this.reputation = this.user.reputation;

      this.matchService.getMyMatches(this.username).subscribe(data => this.matches = data);
    } else {
      
    }

}

addReputation(player: Player): void //add reputation to player
{
  this.userService.addReputation(player.username);
}

onDescChange() //when profile description is updated user service is called to update profile description
{
  this.userService.updateProfDesc(this.description, this.user.id);
  this.user.profDescr = this.description;
  localStorage.setItem('User', JSON.stringify(this.user));
}

leaveMatch(match: matchModel): void //leave match 
{
  this.kickPlayer(this.user, match);
}

kickPlayer(player: Player, match: matchModel): void //remove player from match
{
  match.players = match.players.filter(p => p.username !== player.username); //find player in player list based on provided username
  this.matchService.kickPlayer(match.locationName.name, match.date.toString(), player.username);
}

}
