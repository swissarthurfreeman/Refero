import { Component, Input, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { RefService } from '../../../shared/services/ref.service';
import { Referential } from '../../../shared/models/referential.model';
import { Observable } from 'rxjs';
import {MappingConfig} from "../containers/injection-edit-container.component";

@Component({
  selector: 'app-mapping-config-presentational',
  templateUrl: './mapping-config-presentational.component.html'
})
export class MappingConfigPresentationalComponent {
  @Input() MappingConfigFormGroup!: FormGroup<MappingConfig>; // base FormArray control of injection-edit input.
  @Input() destRef!: Referential;
  @Input() srcRef!: Referential;             // id of source referential in select.
}
