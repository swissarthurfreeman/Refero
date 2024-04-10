import { Component, Input } from '@angular/core';
import { Referential } from '../../../../../shared/models/referential.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-col-config-presentational',
  templateUrl: './col-config-presentational.component.html'
})
export class ColConfigPresentationalComponent {
  @Input() Ref!: Referential;
  @Input() FormControl!: FormControl;
}
