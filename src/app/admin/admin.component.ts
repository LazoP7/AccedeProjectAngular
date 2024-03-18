import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../location/location.service';
import { CustomLocation } from '../Match/Models/location.model';
import { UserService } from '../user/user.service';
import { UserInfo } from '../auth/login/models/UserInfo.model';
import { MatchService } from '../Match/Models/match.service';

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
  isSuccess: boolean = false;
  isError: boolean = false;

  selectedUserRole: string = "Player";
  selectedUsername: string = '';
  selectedUsernameCheck: string = '';
  rolesstr : string = "";
  userRoles: Array<string> = [];
  selectedLocation: string = "";
  selectedMatchType: number = 0;

  payload: CustomLocation = {
    name: '',
    address: '',

  };

  user!: UserInfo;

  constructor(private formBuilder: FormBuilder,
    private locationService: LocationService,
    private userService: UserService,
    private matchService: MatchService
    ){}

    
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      locationName : ['', Validators.required],
      address: ['', Validators.required],
    })
  }
    
  clearForm() //form clear
  {
    this.form.reset();
  }
  onSubmit(form : FormGroup) //on form submit event new location is created that doesnt already exist
  {
    this.payload.name = this.form.controls['locationName'].value;
    this.payload.address = this.form.controls['address'].value;
    const jsonpayload = JSON.stringify(this.payload);

    this.locationService.createLocation(jsonpayload).subscribe(
      (response) => {
        this.form.reset();
        this.locationService.populateLocation(this.payload.name, this.selectedMatchType).subscribe(
          (response) => {
            this.errorMessage = "Successfully created location and matches!"
            this.hasError = true;
            this.isSuccess = true;
          },
          (error) => {
            console.error('Error:', error);
            this.errorMessage = "Matches for this Location and sport type already exist.";
            this.hasError = true;
            this.isError = true;
          }
        );
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = "Location or address already exist";
        this.hasError = true;
        this.isError = true;
      }
    );
    
  }


  closeNotify(): void //clear notification
  {
    this.hasError = false;
    this.isSuccess = false;
    this.isError = false;
    this.errorMessage = '';
  }

  updateRole() //updating user roles
  {
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
    this.userService.getUser(this.selectedUsername).subscribe(
      (response) => {
        this.user = response;
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = "User doesnt exist";
        this.hasError = true;
        this.isError = true;
      }
    );
    if(this.user != null){
      this.userService.updateUserRoles(this.user.id, this.rolesstr).subscribe(
        (response) => {
          this.errorMessage = "Successfully updated User roles!"
          this.hasError = true;
          this.isSuccess = true;
        }
      );
    }
  }
 
  checkRoles() //check if user has roles
  {
    this.userService.checkRoles(this.selectedUsernameCheck).subscribe(
      (response) => {
        this.userRoles = response,
        localStorage.setItem('userRoles', JSON.stringify(this.userRoles))
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = "User doesnt exist";
        this.hasError = true;
        this.isError = true;
      }
    );
  }

  getType(event: any) //get type for selected match
  {
    this.selectedMatchType = event.target.selectedIndex;
    console.log(this.selectedMatchType);
  }
  
  
  crateMatches() //add new matches to already existing locations
  {
    this.locationService.populateLocation(this.selectedLocation, this.selectedMatchType).subscribe(
      (response) => {
        this.errorMessage = "Successfully added new matches to location"
          this.hasError = true;
          this.isSuccess = true;
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = "This location doesnt exist";
        this.hasError = true;
        this.isError = true;
      }
    );
    console.log(this.selectedLocation, this.selectedMatchType);
  }

}
