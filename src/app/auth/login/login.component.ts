import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserDTO } from './models/user.model';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit{

  constructor(
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ){}

  loginForm: FormGroup = new FormGroup({});

  username = String('');
  password = String('');
  rememberme : boolean = false;

  userCred: UserDTO = {
    username: '',
    password: '',
    rememberMe: false
  };

  hasError: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
    
  }

  closeNotify(): void {
    this.hasError = false;
    this.errorMessage = '';
  }


  onSubmit(){
    const userCred = this.loginForm.value;
    if (userCred) {
      this.loginService.getToken(userCred).subscribe(
        async (token) => {
          localStorage.setItem('JwtToken', token.accessToken);
          localStorage.setItem('refreshToken', token.refreshToken);
          localStorage.setItem('Username', JSON.stringify(userCred.username))
          this.userService.getUser(userCred.username).subscribe(user => {
            localStorage.setItem('User', JSON.stringify(user));
          })
          await new Promise(f => setTimeout(f, 200));
          this.loginService.isAuth.next(true);
          this.router.navigate(['/home']);
        },
        (error) => {
          this.hasError = true;
          this.errorMessage = 'Invalid login credentials'
          console.error('Error getting token:', error);
          this.loginService.isAuth.next(false);
        }
      );
    }
  }

  rememberMe() {
    this.rememberme = !this.rememberme;
  }
  


}
