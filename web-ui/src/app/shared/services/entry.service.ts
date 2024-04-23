import { Injectable } from '@angular/core';
import { Entry } from '../models/record.model';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

/**
 * Referential management service. This class is for the time being purely
 * mocking API endpoints. 
 */
@Injectable({
  providedIn: 'root'
})
export class EntryService {
  constructor(private http: HttpClient) {}

  getEntryBy(id: string): Observable<Entry> {
    return this.http.get<Entry>(`http://localhost:8080/entries/${id}`);
  }

  getEntriesOf(refId: string): Observable<Entry[]> {
    return this.http.get<Entry[]>(`http://localhost:8080/entries?ref_id=${refId}`);
  }

  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`http://localhost:8080/entries`);
  }

  postEntry(entry: Entry): Observable<Entry> {
    return this.http.post<Entry>(`http://localhost:8080/entries`, {
      "ref_id": entry.ref_id,
      "fields": entry.fields
    })
  }

  putEntry(entry: Entry): Observable<Entry> {
    return this.http.put<Entry>(`http://localhost:8080/entries/${entry.id}`, entry);
  }
}
