import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Headers,  } from '@angular/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: Subject<any>;

  constructor(
    private wsService: WebsocketService,
    private authservice: AuthService,
    private http: Http
    ) {
    this.messages = <Subject<any>>wsService
    .connect()
    .pipe(
    map((response: any): any => {
      return response;
      })
    );
   }

   sendMsg(msg) {
     this.messages.next(msg);
   }


   // Checks if a chat is already present  
   findRecipient(recipient) {
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.authservice.authToken
    });
    const url = 'http://localhost:3000/chat/find/' + recipient;
    //console.log(url);
    //console.log(this.authservice.authToken + "   from findRecp()");
    return this.http.get(url , { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }

  // Creates a new chat,with sender and receiver
  newChat(recipient) {
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.authservice.authToken
    });
    const url = 'http://localhost:3000/chat/new/' + recipient;
    //console.log(url);
    //console.log(this.authservice.authToken);
    return this.http.get(url , { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }


  sendReply(message) {
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.authservice.authToken
    });
    const url = 'http://localhost:3000/chat/' + message.conversation_id;
    return this.http.post(url, message , { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }

}
