import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "../login.service";

@Injectable({providedIn:'root'})
export class alreadyAuthenticatedGuard implements CanActivate{

    constructor(private loginService: LoginService){}
    canActivate(): boolean { 
        if(localStorage.getItem('JwtToken') != null){
            return true;
        } else {
            return this.loginService.isAuth.getValue();
        }
    }

}