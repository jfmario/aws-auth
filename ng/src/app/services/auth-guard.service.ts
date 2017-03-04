
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot }
    from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate
{

    constructor ( private authService: AuthService,
        private router: Router ) {}
    
    canActivate ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot )
    {
        
        let url: string = state.url;

        if ( this.authService.currentUsername && this.authService.currentToken )
            return true;
        else
        {
            this.authService.redirectUrl = url;
            this.router.navigate ( ['/register'] );
        }
    }
};