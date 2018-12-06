import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { Http, Headers,  } from '@angular/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;

  constructor(
    private authservice: AuthService,
    private http: Http
  ) {
   }

  connect(): Rx.Subject<MessageEvent> {

    this.socket = io('http://localhost:3000');
    this.socket.on('connect', () => {
      console.log('from websocket.service.ts ' + this.socket.id); // true
    });
    const observable = new Observable(observer => {
      this.socket.on('new message', (data) => {
        console.log('Received message from websocket Server');
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });

  const observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Rx.Subject.create(observer, observable);
  }

  joinRoom(data) {
    this.socket.emit('join', data);

  }
}
