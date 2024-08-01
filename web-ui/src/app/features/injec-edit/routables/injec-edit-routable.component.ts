import {Component, Input, OnInit} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Referential } from '../../../shared/models/referential.model';
import { RefConfigState } from '../../../shared/stores/ref-config-edit/ref-config.state';
import {SelectRefConfigToEdit} from "../../../shared/stores/ref-config-edit/ref-config.action";
import {RefService} from "../../../shared/services/ref.service";

@Component({
  selector: 'app-injec-edit',
  templateUrl: './injec-edit-routable.component.html'
})
export class InjecEditRoutableComponent implements OnInit {
  @Select(RefConfigState.getRef) ref$!: Observable<Referential>;

  constructor(public store: Store, public rs: RefService) {}

  @Input() refid!: string;
  refs$!: Observable<Referential[]>;

  ngOnInit(): void {
    console.log(this.refid);  // to be able to directly reach url /config/refid/injections
    this.refs$ = this.rs.getReferentials();
    this.rs.getReferentialBy(this.refid).subscribe((ref) => {
      this.store.dispatch(new SelectRefConfigToEdit(ref));
    })
  }
}
