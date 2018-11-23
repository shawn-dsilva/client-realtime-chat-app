var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ChatService } from '../../services/chat.service';
import * as io from 'socket.io-client';
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(authService, router, flashMessage, chat) {
        this.authService = authService;
        this.router = router;
        this.flashMessage = flashMessage;
        this.chat = chat;
        this.socket = io('http://localhost:3000');
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.getUserData().subscribe(function (data) {
            _this.user = data.user;
            _this.socket.emit('userdata', _this.user);
        }, function (err) {
            console.log(err);
            return false;
        });
        this.chat.messages.subscribe(function (msg) {
            console.log(msg);
        });
    };
    DashboardComponent.prototype.sendMessage = function () {
        var _this = this;
        var msg = {
            user: this.user,
            message: this.message,
        };
        this.chat.sendMsg(msg); // sends message object
        this.message = null; // clears input box
        this.socket.on('message', function (message) {
            _this.sender = _this.message;
        });
    };
    DashboardComponent.prototype.onLogoutClick = function () {
        this.authService.logout();
        this.flashMessage.show('You are logged out', {
            cssClass: 'alert-success',
            timeout: 3000
        });
        this.router.navigate(['/login']);
        return false;
    };
    DashboardComponent = __decorate([
        Component({
            selector: 'app-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.css']
        }),
        __metadata("design:paramtypes", [AuthService,
            Router,
            FlashMessagesService,
            ChatService])
    ], DashboardComponent);
    return DashboardComponent;
}());
export { DashboardComponent };
//# sourceMappingURL=dashboard.component.js.map