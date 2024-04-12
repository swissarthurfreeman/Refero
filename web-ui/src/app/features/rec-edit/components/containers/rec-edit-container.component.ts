import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RefViewState } from '../../../../shared/stores/ref-view/ref-view.state';
import { Observable } from 'rxjs';
import { Referential } from '../../../../shared/models/referential.model';
import { Record } from '../../../../shared/models/record.model';
import { RefService } from '../../../../shared/services/ref.service';
import { InjectionService } from '../../../../shared/services/injection.service';
import { RecEditState } from '../../../../shared/stores/rec-edit/rec-edit.state';
import { Injection } from '../../../../shared/models/injection.model';
import { SetInjection, SetSrcRef } from '../../../../shared/stores/rec-edit/rec-edit.action';

@Component({
  selector: 'app-rec-edit-container',
  templateUrl: './rec-edit-container.component.html',
  styleUrl: './rec-edit-container.component.scss'
})
export class RecEditContainerComponent implements OnInit {
  ngOnInit(): void {}

  constructor(public ds: RefService, public is: InjectionService, public store: Store) {}

  @Select(RecEditState.getInjection) injection$!: Observable<Injection>;
  @Select(RecEditState.getDestRec) destRec$!: Observable<Record>;
  
  @Select(RecEditState.getSrcRef) srcRef$!: Observable<Referential>;
  @Select(RefViewState.getCurrentRef) destRef$!: Observable<Referential>;

  SelectInjection(injection: Injection) {
    this.store.dispatch([
      new SetSrcRef(this.ds.getRefDataBy(injection.srcId)),
      new SetInjection(injection)
    ]);
  }
}
