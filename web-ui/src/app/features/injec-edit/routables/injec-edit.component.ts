import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RefConfigState } from '../../../shared/stores/ref-config-edit/ref-config.state';
import { Observable } from 'rxjs';
import { Referential } from '../../../shared/models/referential.model';

@Component({
  selector: 'app-injec-edit',
  templateUrl: './injec-edit.component.html'
})
export class InjecEditComponent implements OnInit {
  @Select(RefConfigState.getRef) ref$!: Observable<Referential>;
  
  constructor(public store: Store) {}

  ngOnInit(): void {
  }
}
