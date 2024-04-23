import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RefService } from '../../../shared/services/ref.service';
import { Referential } from '../../../shared/models/referential.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mapping-config-presentational',
  templateUrl: './mapping-config-presentational.component.html'
})
export class MappingConfigPresentationalComponent implements OnInit {
  constructor(public rs: RefService) {}
  ngOnInit(): void {
    this.sourceRef$ = this.rs.getReferentialBy(this.sourceId);
  }

  @Input() FormControl!: FormControl; // base FormArray control of injection-edit input.
  @Input() Ref!: Referential;
  @Input() sourceId!: string;             // id of source referential in select.

  sourceRef$!: Observable<Referential>;
}
