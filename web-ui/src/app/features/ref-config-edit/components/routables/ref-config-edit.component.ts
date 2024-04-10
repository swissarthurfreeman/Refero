import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SelectRefConfigToEdit } from '../../../../shared/stores/ref-config-edit/ref-config.action';
import { RefConfigState } from '../../../../shared/stores/ref-config-edit/ref-config.state';
import { Observable } from 'rxjs';
import { Referential } from '../../../../shared/models/referential.model';

@Component({
  selector: 'app-ref-config-edit',
  templateUrl: './ref-config-edit.component.html',
  styleUrl: './ref-config-edit.component.scss'
})
export class RefConfigEditComponent implements OnInit {
  @Input() RefId: string | undefined = undefined; 
  @Select(RefConfigState.getRef) ref$!: Observable<Referential>;
  
  constructor(public store: Store) {}
  ngOnInit(): void {
    console.log("RefConfigEdit reads RefId :", this.RefId);
    if (this.RefId === undefined) {
      this.RefId = '';
    }
    
    console.log("Dispatch Select Ref to Edit : ", this.RefId);
    this.store.dispatch(new SelectRefConfigToEdit(this.RefId));
  }
}
