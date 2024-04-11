import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Referential } from '../../../../shared/models/referential.model';
import { SetDestRec, SetDestRecId, SetDestRef, SetInjection, SetSrcRef } from '../../../../shared/stores/rec-edit/rec-edit.action';
import { RefViewState } from '../../../../shared/stores/ref-view/ref-view.state';
import { Observable } from 'rxjs';
import { Injection } from '../../../../shared/models/injection.model';
import { SetInjectionMode } from '../../../../shared/stores/ref-view/ref-view.action';

@Component({
  selector: 'app-rec-edit-routable',
  templateUrl: './rec-edit-routable.component.html'
})
export class RecEditRoutableComponent implements OnInit {
  constructor(public store: Store) {}
  @Input() RecId!: string;
  @Input() RefId!: string;

  @Select(RefViewState.getCurrentRef) currRef$!: Observable<Referential>;

  ngOnInit(): void {
    this.currRef$.subscribe(currRef => {
      this.store.dispatch([
        new SetDestRef(currRef),
        new SetDestRecId(this.RecId),
        new SetDestRec(currRef.getRecordById(this.RecId)),
        new SetInjectionMode(true),
        new SetInjection(new Injection("", [], "", [])),
        new SetSrcRef(new Referential("", "", [], []))
      ]);
    })
  }
}
