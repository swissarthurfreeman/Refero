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

  getColfigsOf(refid: string): Observable<Colfig[]> {
    return this.http.get<Colfig[]>(`api/cols?refid=${refid}`);
  }

  getColfigBy(colfigId: string): Observable<Colfig>  {
    return this.http.get<Colfig>(`api/cols/${colfigId}`);
  }

  postColfig(colfig: Colfig): Observable<Colfig> {
    return this.http.post<Colfig>(`api/cols`, colfig);
  }

  /**
   * PUT a Colfig, if specified id does not exist, it is created.
   * @param id
   * @param colfig
   */
  putColfig(id: String, colfig: Colfig): Observable<Colfig> {
    return this.http.put<Colfig>(`api/cols/${id}`, colfig);
  }

  delColfig(id: String): Observable<Colfig> {
    return this.http.delete<Colfig>(`api/cols/${id}`);
  }
}
