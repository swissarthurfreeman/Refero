import {Injectable} from '@angular/core';
import {Referential} from '../models/referential.model';
import {View} from '../models/view.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  constructor(public http: HttpClient) {
  }

  getViewsOf(refid: string): Observable<View[]> {
    return this.http.get<View[]>(`api/views?refid=${refid}`);
  }

  getView(viewId: string): Observable<View> {
    return this.http.get<View>(`api/views/${viewId}`);
  }

  deleteView(viewId: string): Observable<Object> {
    return this.http.delete<Object>(`api/views/${viewId}`);
  }

  postView(view: View): Observable<View> {
    return this.http.post<View>(`api/views`, view);
  }

  putView(viewId: String, view: View): Observable<View> {
    return this.http.put<View>(`api/views/${viewId}`, view);
  }

  getDefaultViewFor(ref: Referential): View {
    let dispcolids = []

    for (let colfig of ref.columns) {
      if (colfig.name != "") {
        dispcolids.push(colfig.id);
      }
    }

    const view: View = new View();

    view.refid = ref.id;
    view.name = "DEFAULT_VIEW";
    view.dispcolids = dispcolids;
    view.searchcolids = dispcolids;

    return view;
  }

  getFileColNamesFor(ref: Referential): Array<String> {
    let fileColNames = []
    for (let colfig of ref.columns) {
      fileColNames.push(colfig.filecolname);
    }
    return fileColNames;
  }
}
