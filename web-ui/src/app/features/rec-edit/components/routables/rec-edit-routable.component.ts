import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RefService } from '../../../../shared/services/ref.service';
import { Referential } from '../../../../shared/models/referential.model';
import { EntryService } from '../../../../shared/services/entry.service';
import { Entry } from '../../../../shared/models/record.model';

@Component({
  selector: 'app-rec-edit-routable',
  templateUrl: './rec-edit-routable.component.html'
})
export class RecEditRoutableComponent implements OnInit {
  constructor(public store: Store, public rs: RefService, public es: EntryService) {}
  @Input() RecId!: string;
  @Input() RefId!: string;

  CurrentRef$!: Observable<Referential>;
  CurrentEntry$!: Observable<Entry>;

  ngOnInit(): void {
    this.CurrentRef$ = this.rs.getReferentialBy(this.RefId);
    this.CurrentEntry$ = this.es.getEntryBy(this.RecId);
  }
}
