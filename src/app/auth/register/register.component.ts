import { Component, Injectable, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomRegisterValidation } from './customValidators/register.validator';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit{


  loginService = inject(LoginService);

  constructor(private formBuilder: FormBuilder){}

  form: FormGroup = new FormGroup({});

  onSubmit(form : FormGroup){
    const payload = this.form.value;
    this.loginService.register(payload).subscribe(() => {
      console.log('User saved');
      this.form.reset();
    });
  }
  // form: FormGroup = new FormGroup({
  //   name : new FormControl(''),
  //   surname : new FormControl(''),
  //   username : new FormControl(''),
  //   password : new FormControl(''),
  //   mail : new FormControl(''),
  //   age : new FormControl(''),
  //   profDesc : new FormControl('')
  // });
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name : ['', Validators.required],
      surname : ['', Validators.required],
      username : ['', [Validators.required, Validators.minLength(4), CustomRegisterValidation.checkUsername.bind(this)]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password : ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      age: ['', [Validators.max(100), Validators.pattern('^[0-9]+$')]],
      profDesc : ['']
    })
  }

  
}