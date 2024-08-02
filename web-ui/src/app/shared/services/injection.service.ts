import { Injectable, Optional } from '@angular/core';
import { Dict } from '../models/record.model';
import { RefService } from './ref.service';
import { Injection } from '../models/injection.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InjectionService {

  constructor(public rs: RefService, public http: HttpClient) {}

  postInjection(injection: Injection): Observable<Injection> {
    return this.http.post<Injection>(`api/injections`, injection);
  }

  putInjection(injectionId: string, injection: Injection): Observable<Injection> {
    return this.http.put<Injection>(`api/injections/${injectionId}`, injection);
  }

  deleteInjection(injectionId: string): Observable<Object> {
    return this.http.delete<Object>(`api/injections/${injectionId}`);
  }
}
