
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'auth-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent
{

    private inputUsername: string = '';
    private inputPassword: string = '';
    private inputEmail: string = '';

    private messages: any[] = [];

    constructor ( private authService: AuthService )
    {

    }

    private login ()
    {
        var self = this;
        this.authService.login ( this.inputUsername, this.inputPassword )
        .then ( data => {
            if ( !data.success )
                    self.messages = [{
                        detail: data.reason,
                        severity: 'error',
                        summary: 'Error'
                    }];
            else self.messages = [{
                detail: "You are now logged in.",
                severity: 'success',
                summary: 'Welcome'
            }];
        });
    }
    private register ()
    {
        var self = this;
        this.authService.register ( this.inputUsername, this.inputPassword,
            this.inputEmail ).then ( data => {
                if ( !data.success )
                    self.messages = [{
                        detail: data.reason,
                        severity: 'error',
                        summary: 'Error'
                    }];
                else self.messages = [{
                    detail: "You may now log in as " + this.inputUsername + '.',
                    severity: 'success',
                    summary: 'Good'
                }];
            });
    }
}