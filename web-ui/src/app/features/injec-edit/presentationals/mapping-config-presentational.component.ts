import { Component, Input } from '@angular/core';
import { RefService } from '../../../shared/services/ref.service';
import { FormControl } from '@angular/forms';
import { Referential } from '../../../shared/models/referential.model';

@Component({
  selector: 'app-mapping-config-presentational',
  templateUrl: './mapping-config-presentational.component.html'
})
export class MappingConfigPresentationalComponent {
  constructor(public ds: RefService) {}
  @Input() FormControl!: FormControl; // base FormArray control of injection-edit input.
  @Input() Ref!: Referential;
  @Input() sourceId = '';             // id of source referential in select.
}
