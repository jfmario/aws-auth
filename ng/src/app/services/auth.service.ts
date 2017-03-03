
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService
{

    private _url: string = 'https://caofyr8x2j.execute-api.us-west-2.amazonaws.com/v0'

    public currentToken: String = null;
    public currentUsername: String = null;

    constructor ( private http: Http ) {}

    public login ( username: string, password: string ): Promise<Boolean>
    {
        var self = this;
        return this.http.post ( this._url + '/login', {
            username: username,
            password: password
        }).toPromise().then ( res => {
            var data = res.json ();
            if ( data.success )
            {
                self.currentUsername = username;
                self.currentToken = data.success;
                return true;
            }
            else return false;
        });
    }

    public register ( username: string, password: string, email: string )
    {
        var self = this;
        return this.http.post ( this._url + '/register', {
            emailAddress: email,
            password: password,
            username: username
        }).toPromise()
    }
};