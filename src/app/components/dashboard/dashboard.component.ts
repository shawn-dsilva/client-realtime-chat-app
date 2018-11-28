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

  user: any;

  username: String;
  name: String;
  author: String;
  message: String;
  sender: String;


  socket = io('http://localhost:3000');

  senderEchos;
  recvEchos;
  userBool;
  userList;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private chat: ChatService

  ) { }



  ngOnInit() {
this.senderEchos = [];
this.recvEchos = [];
this.userList = [];

    this.authService.getUserData().subscribe(data => {
      this.user = data.user;
      this.username = data.user.username;
      this.socket.emit('userdata', this.user);
    },
      err => {
        console.log(err);
        return false;
      });


      this.authService.getUserList().subscribe(data => {
        console.log(data);
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
              if(key !== this.user.username) {
              let val = data[key];
              console.log(val);
              this.userList.push(val);
            }
          }
        }
        /*this.userList.push({
          user_id: data.[0].user_id,
          username: data.[0].username,
          email: data.[0].email,
          name: data.[0].name
        });*/
      },
        err => {
          console.log(err);
          return false;
        });


    this.chat.messages.subscribe(msg => {
      console.log(msg);
      /*if (this.username ===  msg.username ) {*/
      this.userBool = this.user.username ===  msg.username;
      console.log(this.userBool);
      this.senderEchos.push({
        sender:  msg.username,
        text: msg.text
      });
    /*} else {
      this.recvEchos.push({
        recv:  msg.username,
        text: msg.text
      });
    }*/

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

  onUserSelect(user) {
    console.log(JSON.stringify(user) +  ' has been selected');
    this.chat.findRecipient(user._id).subscribe( (data) => {
      console.log(data);
      if (data.isPresent === false) {
        this.chat.newChat(user._id).subscribe( (newchat) => {
          console.log(newchat);
        });
      }
    });
  }

}
