import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ChatService } from '../../services/chat.service';
import { WebsocketService } from 'src/app/services/websocket.service';

const opts = {
  day: 'numeric', weekday: 'short',
  month: 'short', year: 'numeric',
  hour: 'numeric', minute: 'numeric',
  hour12: true,
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewChecked {

  user: any;

  username: String;
  name: String;
  author: String;
  message: String;
  sender: String;
  conversationId: String;
  container: HTMLElement;



  senderEchos;
  recvEchos;
  userBool;
  userList;
  isActive;
  showTextEntryArea;
  currUser;
  prevUser;
  disableScrollDown = false;

  

  constructor(
    private websocketService : WebsocketService,
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
    },
      err => {
        console.log(err);
        return false;
      });


      this.authService.getUserList().subscribe(data => {
        //console.log(data);
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
              if(key !== this.user.username) {
              let val = data[key];
              //console.log(val);
              this.userList.push(val);
            }
          }
        }
      },
        err => {
          console.log(err);
          return false;
        });


    this.chat.messages.subscribe(msg => {
      console.log(msg);
      if (this.conversationId === msg.conversation_id) {
      this.userBool = this.user.username ===  msg.username;
      console.log(this.userBool);
      this.senderEchos.push({
        author: {_id: msg.user_id, name: msg.name, username: msg.username},
        body: msg.body,
        datetime: msg.datetime
        });
        this.scrollToBottom();
      }

    });

  }

    ngAfterViewChecked() {
      this.scrollToBottom();
    }


    private onScroll() {
      let element = this.container;
      let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
      if (this.disableScrollDown && atBottom) {
          this.disableScrollDown = false;
      } else {
          this.disableScrollDown = true;
      }
  }


  scrollToBottom(): void {
    if (this.disableScrollDown) {
      return;
    }
    try {
      this.container = document.getElementById('text-display-area');
      this.container.scrollTop = this.container.scrollHeight;
    } catch (err) { }
}

  sendMessage() {
    const datetime = new Date().toLocaleString('en-IN', opts);
    console.log('CURRENT DATE IS ' + datetime);
    const msg = {
      conversation_id: this.conversationId,
      user_id: this.user._id,
      username: this.user.username,
      name: this.user.name,
      body: this.message,
      datetime: datetime,
    };

    this.chat.sendMsg(msg);                             // sends message object

    const message = {
      conversation_id: this.conversationId,
      user_id: this.user._id,
      text: this.message,
    };

    this.chat.sendReply(message).subscribe( (confirmation) => {
      console.log(confirmation);
    });

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

    // sets isActive property of all users in list to false
    for (const userElement of this.userList) {
      userElement.isActive = false;
      // console.log(entry);

    }

    // sets the isActive property of current user to true,highlighting it in grey
    user.isActive = true;
    this.showTextEntryArea = true;

    //$('#text-display-area').detach();

    // clears the array senderEchos,which in turn clears the displayed messages,"clearing" the screen
    this.senderEchos.splice(0);

    console.log(JSON.stringify(user) +  ' has been selected');

      // Checks if chat with two users is already present
    this.chat.findRecipient(user._id).subscribe( (data) => {
      // If chat is not present,create  a new one
      // and set conversationId with the returned conversationId
      if (!data.isPresent) {
        this.chat.newChat(user._id).subscribe( (newchat) => {
          console.log(newchat);
          this.conversationId = newchat.conversationId;
          //this.socket.emit('join', { room: newchat.conversationId });
          this.websocketService.joinRoom({ room: newchat.conversationId });
        });
      } else {
        // If chat is present,set conversationId to returned conversationId
        this.conversationId = data.conversationId;
        //this.socket.emit('join', { room: data.conversationId });
        this.websocketService.joinRoom({ room: data.conversationId });

        this.chat.getMessages(this.conversationId).subscribe( (message) => {
          for (let i = message.conversation.length - 1; i >= 0; i--) {
            const datetime = new Date(message.conversation[i].createdAt).toLocaleString('en-IN' , opts );
            message.conversation[i].datetime = datetime;
            this.senderEchos.push(message.conversation[i]);

          }

        });

      }
    });

  }

}
