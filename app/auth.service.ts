import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Config } from './app.config';
import { Token } from './token';
import { User } from './user';

@Injectable()
export class AuthService {
  constructor(private http: Http) {
  }

  login(username: string, password: string): Promise<Token> {
    return this.http.post(Config.API_URL + '/oauth/token', { username: username, password: password})
      .toPromise()
      .then((res) => {
        let body = res.json();
        if (body.error) {
          if (body.error == 'Invalid username.') {
            return this.register(username, password)
              .then((user) => {
                return this.login(username, password);
              });
          }
          else {
            return new Token();
          }
        }
        else {
          return new Token(body.token);
        }
      });
  }

  register(username: string, password: string): Promise<User> {
    return this.http.post(Config.API_URL + '/users', { username, password })
      .toPromise()
      .then((res) => {
        let body = res.json();
        return new User(body._id, body.username, body.password);
      });
  }

  me(): Promise<User> {
    let headers = new Headers({ 'Authorization' : 'Basic ' + localStorage.getItem('token') });
    let options = new RequestOptions({ headers : headers });
    return this.http.get(Config.API_URL + '/users/me', options)
      .toPromise()
      .then((res) => {
        let body = res.json();
        return new User(body._id, body.username, body.password);
      });
  }
}
