import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RefViewState } from '../../../../shared/stores/ref-view/ref-view.state';
import { Observable } from 'rxjs';
import { Dictionary, Referential } from '../../../../shared/models/referential.model';
import { RefService } from '../../../../shared/services/ref.service';
import { SelectInjectionSourceRef } from '../../../../shared/stores/ref-view/ref-view.action';

@Component({
  selector: 'app-rec-edit-container',
  templateUrl: './rec-edit-container.component.html',
  styleUrl: './rec-edit-container.component.scss'
})
export class RecEditContainerComponent implements OnInit {
  ngOnInit(): void {
    //this.ref$.subscribe(value => console.log("RecEdit reads :", value));
    //this.rec$.subscribe(value => console.log("RecEdit reads :", value));
  }

  constructor(public ds: RefService, public store: Store) {}

  @Select(RefViewState.getRef) ref$!: Observable<Referential>;
  @Select(RefViewState.getDestRec) rec$!: Observable<Dictionary<string>>;

  @Select(RefViewState.getSourceRef) srcRef$!: Observable<Referential>;

  SelectSrcRef(refId: string) {
    //console.log("Action: SelectInjectionSourceRef :", refId);
    this.store.dispatch(new SelectInjectionSourceRef(refId));
  }
}
