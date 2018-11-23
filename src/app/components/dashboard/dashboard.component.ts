import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ChatService } from '../../services/chat.service';
import * as io from 'socket.io-client';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: Object;

  username: String;
  name: String;
  author: String;
  message: String;
  sender: String;

  senderInnerHtml: string =  '<p class="sender" ><b>{{sender.text}}</b></p>';

  socket = io('http://localhost:3000');


  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private chat: ChatService

  ) { }



  ngOnInit() {

    this.authService.getUserData().subscribe(data => {
      this.user = data.user;
      this.socket.emit('userdata', this.user);
    },
      err => {
        console.log(err);
        return false;
      });

    this.chat.messages.subscribe(msg => {
      console.log(msg);
      this.sender = msg;
      this.senderInnerHtml = this.senderInnerHtml;

    });
  }


  sendMessage() {
    const msg = {
      user: this.user,
      message: this.message,
    };

    this.chat.sendMsg(msg);                             // sends message object
    this.message = null;                                  // clears input box

  }


  onLogoutClick() {
    this.authService.logout();
    this.flashMessage.show('You are logged out', {
      cssClass: 'alert-success',
      timeout: 3000
    });
    this.router.navigate(['/login']);
    return false;
  }

}
