import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InjectionService } from '../../../../shared/services/injection.service';
import { RefService } from '../../../../shared/services/ref.service';
import { Injection } from '../../../../shared/models/injection.model';
import { Referential } from '../../../../shared/models/referential.model';
import { View } from '../../../../shared/models/view.model';
import { Entry } from '../../../../shared/models/record.model';
import { SetInjection } from '../../../../shared/stores/ref-view/ref-view.action';
import { RecEditState } from '../../../../shared/stores/rec-edit/rec-edit.state';
import { SetInjectionSourceRef, SetInjectionSourceRefView } from '../../../../shared/stores/rec-edit/rec-edit.action';


@Component({
  selector: 'app-rec-edit-container',
  templateUrl: './rec-edit-container.component.html',
  styleUrl: './rec-edit-container.component.scss'
})
export class RecEditContainerComponent implements OnInit {
  ngOnInit(): void {}

  constructor(public rs: RefService, public is: InjectionService, public store: Store) {}

  @Input() CurrentEntry!: Entry;
  @Input() CurrentRef!: Referential;

  @Select(RecEditState.getInjectionSourceRef) SourceRef$!: Observable<Referential>;
  @Select(RecEditState.getInjectionSourceRefView) SourceRefView$!: Observable<View>;


  SelectInjection(injection: Injection) {
    this.rs.getReferentialBy(injection.srcId).subscribe((SrcRef) => {
      this.store.dispatch([
        new SetInjectionSourceRef(SrcRef),
        new SetInjectionSourceRefView(SrcRef.views[0]),
        new SetInjection(injection)
      ])
    })
  }
}
