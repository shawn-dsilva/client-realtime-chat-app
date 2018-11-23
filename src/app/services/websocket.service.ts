import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;

  constructor(

  ) { }

  connect(): Rx.Subject<MessageEvent> {

    this.socket = io('http://localhost:3000');

    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        console.log('Received message from websocket Server');
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });

    let observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Rx.Subject.create(observer, observable);
  }
}
