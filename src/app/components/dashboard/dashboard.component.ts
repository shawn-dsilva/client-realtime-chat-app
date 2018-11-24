import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ChatService } from '../../services/chat.service';
import * as io from 'socket.io-client';
import { wrapListenerWithPreventDefault } from '@angular/core/src/render3/instructions';




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


  socket = io('http://localhost:3000');

  chats;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private chat: ChatService

  ) { }



  ngOnInit() {
this.chats = [];
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
      this.chats.push({
        sender:  msg.text
      });
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
