
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

declare var jsSHA: any;

@Injectable()
export class AuthService
{

    private _url: string = 'https://caofyr8x2j.execute-api.us-west-2.amazonaws.com/v1'

    public currentToken: String = null;
    public currentUsername: String = null;

    constructor ( private http: Http ) {}

    public login ( username: string, password: string ): Promise<any>
    {

        var shaObj = new jsSHA ( "SHA-512", 'TEXT' );
        shaObj.update ( password );
        password = shaObj.getHash ( 'HEX' );

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
                return data;
            }
            else return data;
        }).catch ( res => {
            return res.json ();
        });
    }

    public register ( username: string, password: string, email: string ): Promise<any>
    {

        var shaObj = new jsSHA ( "SHA-512", 'TEXT' );
        shaObj.update ( password );
        password = shaObj.getHash ( 'HEX' );

        var self = this;
        return this.http.post ( this._url + '/register', {
            emailAddress: email,
            password: password,
            username: username
        }).toPromise().then ( res => {
            return res.json ();
        }).catch ( res => {
            return res.json ();
        });
    }
};