import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "../login.service";

@Injectable({providedIn:'root'})
export class alreadyAuthenticatedGuard implements CanActivate{

    constructor(private loginService: LoginService){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return !this.loginService.subject.getValue();
    }

}