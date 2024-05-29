import { Injectable } from '@angular/core';
import { Referential } from '../models/referential.model';
import * as jsonRefOfsReeData from '../../../assets/mock-data/REF_OFS_REE_DATA.json'
import * as jsonRefOfsReeStatut from '../../../assets/mock-data/REF_OFS_REE_STATUT.json'
import * as jsonRefOfsReeType from '../../../assets/mock-data/REF_OFS_REE_TYPE.json'
import { ViewService } from './view.service';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

/**
 * Referential management service. This class is for the time being purely
 * mocking API endpoints. 
 */
@Injectable({
  providedIn: 'root'
})
export class RefService {
  getRecordById(RefId: string, RecId: string): import("../models/record.model").Record {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  getReferentialBy(refId: string): Observable<Referential> {
    return this.http.get<Referential>(`api/refs/${refId}`);
  }

  getReferentials(): Observable<Referential[]> {
    return this.http.get<Referential[]>(`api/refs`);
  }

  putReferential(referential: Referential): Observable<Referential> {
    return this.http.put<Referential>(`api/refs/${referential.id}`, {
      "name": referential.name,
      "description": referential.description
    })
  }
}
