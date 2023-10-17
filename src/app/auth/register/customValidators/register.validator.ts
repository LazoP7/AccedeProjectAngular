import { AbstractControl, ValidationErrors, Validator, ValidatorFn } from "@angular/forms";
import { ValidationService } from "./validation.service";
import { UserDTO } from "../../login/models/user.model";

export class CustomRegisterValidation {
    static validationService: any;
    static userDTO: any;

    constructor(private validationService: ValidationService){}

    userDTO?: UserDTO;

    static checkUsername(username: string): ValidatorFn {
        return (controls: AbstractControl) => {
            const control = this.validationService.getUsername(username).subscribe((data: any) => {this.userDTO = data});

            if(this.userDTO == undefined){
                return {userExcist: true}
            }
            else {
                return {usernameValidationStatus: 'INVALID'}
            }
        }
    }


}
