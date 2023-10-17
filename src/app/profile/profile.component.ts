import { Component } from '@angular/core';
import { UserDTO } from '../auth/login/models/user.model';
import { matchModel } from '../Match/Models/match.model';
import { MatchService } from '../Match/Models/match.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  public matches : matchModel[] = [];

  constructor(private matchService: MatchService) {}


  ngOnInit(): void {

    this.matchService.getMyMatches().subscribe(data => this.matches = data);
    
}

}
