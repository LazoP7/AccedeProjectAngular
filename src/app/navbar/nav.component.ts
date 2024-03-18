import { Component , OnInit} from '@angular/core';
import { LoginService } from '../auth/login.service';
import { UserInfo } from '../auth/login/models/UserInfo.model';
import { UserService } from '../user/user.service';
import { MatchService } from '../Match/Models/match.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
  })

export class NavComponent implements OnInit {

  isUserAuthenticated: boolean = false;
  user : UserInfo= {
    id: 0,
    name : '',
    surname: '',
    username: '',
    mail: '',
    reputation: 0,
    age: 0,
    profDescr: ''
  }

  userRoles: Array<string> = [];

  constructor(private loginService: LoginService,
    private userService: UserService ,
    private matchService: MatchService,
    private router: Router,
    ){};

  ngOnInit(): void {
    this.loginService.isAuth.subscribe(data => {
      this.isUserAuthenticated = data,
      this.checkLogInStatus();
    })
    this.selectedImg = localStorage.getItem('navImg');
  }

  navbarItems: any[] = [ 
    {title: 'Home', url : '/home'},
    {title: 'About', url : '/about'},
  ];
  navbarItemsApnd: any[] = []

  navbarPlayer : any = {
    title: 'Profile', url: '/profile'
  }
  navbarOwner : any = {
    title: 'Owner', url: '/owner'
  }
  navbarAdmin : any = {
    title: 'Admin', url: '/admin'
  }

  checkLogInStatus(): void //check if user is authenticated and user roles
  {
    const struser = localStorage.getItem('User');
  
    if (struser) {
      this.user = JSON.parse(struser);
      this.userService.checkRoles(this.user.username).subscribe(data => {
        this.userRoles = data;
  
        this.navbarItemsApnd = [];
  
        if (this.userRoles.includes("Player")) {
          this.navbarItemsApnd.push(this.navbarPlayer);
        }
        if (this.userRoles.includes("Owner")) {
          this.navbarItemsApnd.push(this.navbarOwner);
        }
        if (this.userRoles.includes("Admin")) {
          this.navbarItemsApnd.push(this.navbarAdmin);
        }
  
        this.navbarItems = this.navbarItems.filter(item => ![this.navbarPlayer, this.navbarOwner, this.navbarAdmin].includes(item));
        this.navbarItems = [...this.navbarItems, ...this.navbarItemsApnd];
        this.isUserAuthenticated = true;
      });
    } else {
      this.isUserAuthenticated = false;
      this.navbarItems = this.navbarItems.filter(item => ![this.navbarPlayer, this.navbarOwner, this.navbarAdmin].includes(item));
    }
  }
  
  


setUserAuthenticated(set: boolean) // change user authentication
{
  this.loginService.isAuth.subscribe(data => this.isUserAuthenticated = data);
}

isActive: boolean = false;


onClickBurger(): void //on mouse click on burger
{
  this.isActive = !this.isActive;
  console.log(this.isActive)
}

selectedImg: any = "../../assets/basketball.png";


selectedBasket():void //on selected icon basketball
{
  this.matchService.changeMatchType(0);
  window.location.reload();
  localStorage.setItem("navImg", "../../assets/basketball.png")
}
selectedFootball():void //on selected icon football
{
  this.matchService.changeMatchType(1);
  window.location.reload();
  localStorage.setItem("navImg", "../../assets/football.png")
  
}
selectedTennis():void //on selected icon tennis
{
  this.matchService.changeMatchType(2);
  window.location.reload();
  localStorage.setItem("navImg", "../../assets/tennis.png")
}

LogOut(): void //user logout, clear saved user data
{
  localStorage.clear();
  localStorage.setItem('navImg', this.selectedImg);
  localStorage.setItem('JwtToken', '');
  localStorage.setItem('refreshToken', '');
  this.setUserAuthenticated(false);
  setTimeout(() => {this.checkLogInStatus();
    this.router.navigate(['/home']);},100)
}


}