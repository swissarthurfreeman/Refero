import { Injectable } from '@angular/core';
import { Referential } from '../models/referential.model';
import { ViewService } from './view.service';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import {Colfig} from "../models/Colfig.model";


@Injectable({
  providedIn: 'root'
})
export class RefService {
  getRecordById(refid: string, RecId: string): import("../models/record.model").Record {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  getReferentialBy(refid: string): Observable<Referential> {
    return this.http.get<Referential>(`api/refs/${refid}`);
  }

  getReferentials(): Observable<Referential[]> {
    return this.http.get<Referential[]>(`api/refs`);
  }

  putReferential(id: string, ref: Referential): Observable<Referential> {
    return this.http.put<Referential>(`api/refs/${id}`, {
      "name": ref.name,
      "description": ref.description,
      "code": ref.code
    })
  }

  postReferential(ref: Referential): Observable<Referential> {
    return this.http.post<Referential>(`api/refs`, {
      "name": ref.name,
      "description": ref.description,
      "code": ref.code
    })
  }

  delReferential(id: String): Observable<Object> {
    return this.http.delete<Object>(`api/refs/${id}`);
  }

  getRefColById(ref: Referential, colId: String): Colfig | undefined {
    for(let col of ref.columns) {
      if(col.id == colId) {
        return col;
      }
    }
    return undefined;
  }
}
