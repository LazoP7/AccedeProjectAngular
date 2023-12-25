import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../location/location.service';
import { CustomLocation } from '../Match/Models/location.model';
import { UserService } from '../user/user.service';
import { UserInfo } from '../auth/login/models/UserInfo.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styles: [
  ]
})
export class AdminComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  errorMessage: string = '';
  hasError: boolean = false;

  selectedUserRole: string = "Player";
  selectedUsername: string = '';
  selectedUsernameCheck: string = '';
  rolesstr : string = "";
  userRoles: Array<string> = [];

  payload: CustomLocation = {
    name: '',
    address: '',
  };

  user!: UserInfo;

  constructor(private formBuilder: FormBuilder,
    private locationService: LocationService,
    private userService: UserService){}

    
  clearForm(){
    this.form.reset();
  }
  onSubmit(form : FormGroup){
    this.payload.name = this.form.controls['locationName'].value;
    this.payload.address = this.form.controls['address'].value;
    const jsonpayload = JSON.stringify(this.payload);

    
    
    this.locationService.createLocation(jsonpayload).subscribe(
      (response) => {
        this.form.reset();
      },
      (error) => {
        console.error('Error:', error);

      }
    );
    this.locationService.populateLocation(this.payload.name).subscribe(
      (response) => {
      },
      (error) => {
        console.error('Error:', error);

      }
    );
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      locationName : ['', Validators.required],
      address: ['', Validators.required],
    })
  }

  closeNotify(): void {
    this.hasError = false;
    this.errorMessage = '';
  }

  updateRole(){
    if(this.selectedUserRole == "Player"){
      this.rolesstr = "";
      this.rolesstr = "Player"
    }
    if(this.selectedUserRole == "Owner"){
      this.rolesstr = "";
      this.rolesstr = "Player,Owner"
    }
    if(this.selectedUserRole == "Admin"){
      this.rolesstr = "";
      this.rolesstr = "Player,Admin"
    }
    this.userService.getUser(this.selectedUsername).subscribe(data => this.user = data)
    if(this.user != null){
      this.userService.updateUserRoles(this.user.id, this.rolesstr);
    }
  }

  checkRoles(){
    this.userService.checkRoles(this.selectedUsernameCheck).subscribe(data => {this.userRoles = data,
    localStorage.setItem('userRoles', JSON.stringify(this.userRoles))})
  }
}
