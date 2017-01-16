import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';

import { AuthService } from './auth.service';
import { Config } from './app.config';

@Component({
  selector: 'chat',
  templateUrl: 'chat.component.html',
  styleUrls: [ 'assets/css/index.css', 'assets/css/chat.component.css' ]
})
export class ChatComponent implements OnInit {
  messages: any[] = [ ];
  message: string;
  socket: any;

  constructor(private router: Router, private auth: AuthService) {
    // initialize socket connection
    this.socket = io(Config.API_URL + '?token=' + localStorage.getItem('token'));
  }

  ngOnInit() {
    // logged in user
    this.auth.me().then((res) => {
      // if no logged in user
      if (!res || !res._id) {
        // redirect to login page
        this.router.navigate([ '/login' ]);
      }
      else {
        // add receive message handler
        this.socket.on('message', (message:any) => {
          // add message received to this.messages
          if (message instanceof Array) {
            this.messages = this.messages.concat(message);
          }
          else {
            this.messages.push(message);
          }
        });

        // send request to get messages
        this.socket.emit('get messages');
      }
    });

  }

  send() {
    // emit message to server
    this.socket.emit('message', this.message);
    this.message = '';
  }

  logout() {
    // remove token
    localStorage.removeItem('token');
    // redirect to login
    this.router.navigate([ '/login' ]);
  }
}
