import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RefConfigState } from '../../../../shared/stores/ref-config-edit/ref-config.state';
import { Referential } from '../../../../shared/models/referential.model';
import { SelectRefConfigToEdit } from '../../../../shared/stores/ref-config-edit/ref-config.action';
import { RefService } from '../../../../shared/services/ref.service';

@Component({
  selector: 'app-ref-config-edit',
  templateUrl: './ref-config-edit.component.html',
  styleUrl: './ref-config-edit.component.scss'
})
export class RefConfigEditComponent implements OnInit {
  constructor(public store: Store, public rs: RefService) {}
  
  @Input() RefId: string | undefined = undefined;         // routable is reached from config/:RefId or config/
  @Select(RefConfigState.getRef) ref$!: Observable<Referential>;
  
  ngOnInit(): void {
    if (this.RefId === undefined) {
      let ref = new Referential();
      ref.columns = [];
      ref.injections = [];
      ref.views = [];
      this.store.dispatch(new SelectRefConfigToEdit(ref));  // then we're creating a new referential, observable emits.
    } else {
      this.rs.getReferentialBy(this.RefId).subscribe((ref) => {
        this.store.dispatch(new SelectRefConfigToEdit(ref));
      });
    }
  }
}
