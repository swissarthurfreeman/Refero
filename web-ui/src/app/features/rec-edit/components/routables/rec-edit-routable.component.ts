import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RefService } from '../../../../shared/services/ref.service';
import { Referential } from '../../../../shared/models/referential.model';
import { EntryService } from '../../../../shared/services/entry.service';
import { Entry, Record } from '../../../../shared/models/record.model';
import { Colfig } from '../../../../shared/models/Colfig.model';
import { v4 as uuid } from 'uuid';
import {RefViewState} from "../../../../shared/stores/ref-view/ref-view.state";
import {View} from "../../../../shared/models/view.model";
import {SetCurrentView} from "../../../../shared/stores/ref-view/ref-view.action";

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
    this.CurrentRef$.subscribe((ref) => {
      // if there's a current view
      if(this.store.snapshot()['refView']['currView']) {
        console.log("Using previous view.");
      } else {
        console.log("Set current view.");
        this.store.dispatch(new SetCurrentView(ref.views[0]));
      }
    })

    if(this.RecId === 'new') {
      console.log("RecId is empty, new Rec time");
      // create a new Entry wrapped in an observable
      this.CurrentEntry$ = new Observable<Entry>((sub) => {
        let e = new Entry();
        e.id = uuid().toString();
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
