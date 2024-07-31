import {Component, Input, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {RefConfigState} from '../../../../shared/stores/ref-config-edit/ref-config.state';
import {Referential} from '../../../../shared/models/referential.model';
import {SelectRefConfigToEdit} from '../../../../shared/stores/ref-config-edit/ref-config.action';
import {RefService} from '../../../../shared/services/ref.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-ref-config-edit',
  templateUrl: './ref-config-edit-routable.component.html',
  styleUrl: './ref-config-edit-routable.component.scss'
}) // TODO : route back to / if the requested ref doesn't exist.
export class RefConfigEditRoutableComponent implements OnInit {
  constructor(public store: Store, public rs: RefService) {}

  @Input() refid: string | undefined = undefined;         // routable is reached from config/:refid or config/
  @Select(RefConfigState.getRef) ref$!: Observable<Referential>;

  ngOnInit(): void {
    if (this.refid === undefined) {
      let ref: Referential = new Referential();              // if id is undefined, assign it.
      ref.id = uuid().toString();
      this.store.dispatch(new SelectRefConfigToEdit(ref));  // then we're creating a new referential
    } else {
      this.rs.getReferentialBy(this.refid).subscribe(
        (ref: Referential) => {
          this.store.dispatch(new SelectRefConfigToEdit(ref));
        });
    }
  }
}
