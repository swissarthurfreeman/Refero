import { Injectable } from '@angular/core';
import { Referential } from '../models/referential.model';
import { Dict } from '../models/record.model';
import { v4 as uuidv4 } from 'uuid';
import { View } from '../models/view.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  constructor(public http: HttpClient) {}

  getViewsOf(refId: string): Observable<View[]> {
    return this.http.get<View[]>(`http://localhost:8080/views?ref_id=${refId}`);
  }

  getView(viewId: string): Observable<View> {
    return this.http.get<View>(`http://localhost:8080/views/${viewId}`);
  }
  postView(view: View): Observable<View> {
    return this.http.post<View>(`http://localhost:8080/views`, {
      name: view.name,
      dispColIds: view.dispColIds,
      searchColIds: view.searchColIds,
      ref_id: view.ref_id
    })
  }
}
