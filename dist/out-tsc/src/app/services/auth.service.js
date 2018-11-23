var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, Headers, } from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
var helper = new JwtHelperService();
var AuthService = /** @class */ (function () {
    function AuthService(http) {
        this.http = http;
    }
    AuthService.prototype.registerUser = function (user) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/register', user, { headers: headers })
            .pipe(map((function (res) { return res.json(); })));
    };
    AuthService.prototype.authenticateUser = function (user) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/authenticate', user, { headers: headers })
            .pipe(map((function (res) { return res.json(); })));
    };
    AuthService.prototype.getProfile = function () {
        this.loadToken();
        var headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.authToken
        });
        return this.http.get('http://localhost:3000/users/profile', { headers: headers })
            .pipe(map((function (res) { return res.json(); })));
    };
    // Gets user data in json format
    AuthService.prototype.getUserData = function () {
        this.loadToken();
        var headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.authToken
        });
        return this.http.get('http://localhost:3000/users/profile', { headers: headers })
            .pipe(map((function (res) { return res.json(); })));
    };
    AuthService.prototype.storeUserData = function (token, user) {
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.authToken = token;
        this.user = user;
    };
    AuthService.prototype.loadToken = function () {
        var token = localStorage.getItem('id_token');
        this.authToken = token;
    };
    AuthService.prototype.logout = function () {
        this.authToken = null;
        this.user = null;
        localStorage.clear();
    };
    AuthService.prototype.loggedIn = function () {
        var isExpired = !helper.isTokenExpired(localStorage.getItem('id_token'));
        return isExpired;
    };
    AuthService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [Http])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth.service.js.map