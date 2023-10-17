import { Component, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserDTO } from './models/user.model';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  constructor(
    private loginService: LoginService,
    private router: Router
  ){}

  username = String('');
  password = String('');
  rememberme : boolean = false;

  userCred! : UserDTO;

  onSubmit(form : NgForm){
    this.username = form.value.username;
    this.password = form.value.password;
    if (this.userCred) {
      this.userCred.username = this.username;
      this.userCred.password = this.password;
      this.userCred.rememberMe = this.rememberme;
    }
    
    this.loginService.getToken(this.userCred).subscribe(token => {
      localStorage.setItem('JwtToken', token.JwtToken);
      localStorage.setItem('refreshToken', token.RefreshToken);
      this.loginService.subject.next(true);
      this.router.navigate(['/home'])
      });
  }

  rememberMe(){
    this.rememberme!;
  }


}
