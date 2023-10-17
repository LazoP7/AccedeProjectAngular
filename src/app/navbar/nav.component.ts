import { Component , OnInit} from '@angular/core';
import { LoginService } from '../auth/login.service';

@Component({
    selector: 'app-navbar-nav',
    templateUrl: './nav.component.html'
  })

export class NavComponent implements OnInit {

  isUserAuthenticated: boolean = false;

  constructor(private loginService: LoginService){};

  ngOnInit(): void {
    this.loginService.subject.subscribe(data => {
      this.isUserAuthenticated = data;
    })
  }

  navbarItems: any[] = [ 
    {title: 'Home', url : '/home'},
    {title: 'Profile', url : '/profile'},
    {title: 'About', url : '/about'},


    
];

isActive: boolean = false;

    onClickBurger(): void {
        this.isActive = !this.isActive;
    }

    selectedImg: any = "../../assets/basketball.png";

    selectedBasket():void {
      this.selectedImg = "../../assets/basketball.png" ;
    }
    selectedFootball():void {
      this.selectedImg = "../../assets/football.png" ;
    }
    selectedTennis():void {
      this.selectedImg = "../../assets/tennis.png" ;
    }

    

}