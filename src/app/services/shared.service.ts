import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SharedService {

  header = new HttpHeaders();


  constructor(private http: HttpClient) { }

  passwordValidation(hash: string): Observable<any> {
    this.header.append('Content-Type', 'application/json');
    this.header.append('Access-Control-Allow-Origin', '*');

    const url = `https://api.pwnedpasswords.com/range/${hash}`;
    return this.http.get(url, { headers: this.header, responseType: 'text' }).pipe();
  }
}
