import { Injectable, Optional } from '@angular/core';
import { Dict } from '../models/record.model';
import { RefService } from './ref.service';
import { Injection } from '../models/injection.model';
import { ViewService } from './view.service';
import { Observable } from 'rxjs';
import { Colfig } from '../models/Colfig.model';
import { HttpClient } from '@angular/common/http';
import { Select } from '@ngxs/store';
import { RefViewState } from '../stores/ref-view/ref-view.state';

@Injectable({
  providedIn: 'root'
})
export class ColfigService {

  constructor(private http: HttpClient) {}

  getColfigsOf(refId: string): Observable<Colfig[]> {
    return this.http.get<Colfig[]>(`api/cols?ref_id=${refId}`);
  }

  getColfigBy(colfigId: string): Observable<Colfig>  {
    return this.http.get<Colfig>(`api/cols/${colfigId}`);
  }

  postColfig(colfig: Colfig): Observable<Colfig> {
    return this.http.post<Colfig>(`api/cols`, colfig);
  }
}