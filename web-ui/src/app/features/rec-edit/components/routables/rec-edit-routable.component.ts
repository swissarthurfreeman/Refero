import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RefService } from '../../../../shared/services/ref.service';
import { Referential } from '../../../../shared/models/referential.model';
import { EntryService } from '../../../../shared/services/entry.service';
import { Entry, Record } from '../../../../shared/models/record.model';
import { Colfig } from '../../../../shared/models/Colfig.model';

@Component({
  selector: 'app-rec-edit-routable',
  templateUrl: './rec-edit-routable.component.html'
})
export class RecEditRoutableComponent implements OnInit {
  constructor(public store: Store, public rs: RefService, public es: EntryService) {}
  @Input() RecId!: string;  // from URL
  @Input() refid!: string;

  CurrentRef$!: Observable<Referential>;
  CurrentEntry$!: Observable<Entry>;

  ngOnInit(): void {
    this.CurrentRef$ = this.rs.getReferentialBy(this.refid);
    if(this.RecId === '') {
      console.log("RecId is empty, new Rec time");
      this.CurrentEntry$ = new Observable<Entry>((sub) => { // create a new Entry wrapped in an observable
        let e = new Entry();
        e.refid = this.refid;
        this.CurrentRef$.subscribe((ref) => {
          e.fields = this.getEmptyRecordFromColfigs(ref.columns);
          sub.next(e);
        })
      })
    } else {
      this.CurrentEntry$ = this.es.getEntryBy(this.RecId);
    }
  }

  getEmptyRecordFromColfigs(cols: Colfig[]): Record {
    let rec: Record = {};
    for(let col of cols) {
      rec[col.id] = '';
    }
    return rec;
  }
}
