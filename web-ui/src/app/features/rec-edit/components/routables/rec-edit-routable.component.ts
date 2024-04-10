import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SelectDestRec, SelectInjectionSourceRef, SetInjectionSrcRef, SetInjectionViewMode } from '../../../../shared/stores/ref-view/ref-view.action';
import { Referential } from '../../../../shared/models/referential.model';

@Component({
  selector: 'app-rec-edit-routable',
  templateUrl: './rec-edit-routable.component.html'
})
export class RecEditRoutableComponent implements OnInit {
  constructor(public store: Store) {}
  @Input() RecId!: string;
  @Input() RefId!: string;

  ngOnInit(): void {
    // action, select Record
    //console.log("RecEdit Routable SelectsDestRec", this.RefId, this.RecId);
    this.store.dispatch([
      new SelectDestRec(this.RefId, this.RecId),
      new SetInjectionViewMode(true),
      new SetInjectionSrcRef(new Referential("", "", [], []))
    ]);
  }

}
