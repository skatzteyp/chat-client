import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'assets/css/index.css', 'assets/css/login.component.css' ]
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  error: boolean = false;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    // get logged in user
    this.auth.me().then((res) => {
      // if already logged in
      if (res && res._id) {
        // redirect to chat page
        this.router.navigate([ '/chat' ]);
      }
    });
  }

  login() {
    // login user
    this.auth.login(this.username, this.password)
      .then((res) => {
        // if correct username and password
        if (res.token) {
          // set token in localStorage
          localStorage.setItem('token', res.token);
          // redirect to chat page
          this.router.navigate([ '/chat' ]);
        }
        else {
          // show errors
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 2000);
        }
      });
  }
}
