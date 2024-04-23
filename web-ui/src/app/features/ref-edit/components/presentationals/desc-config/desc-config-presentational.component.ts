import { Component, Input } from '@angular/core';
import { Referential } from '../../../../../shared/models/referential.model';

@Component({
  selector: 'app-desc-config-presentational',
  templateUrl: './desc-config-presentational.component.html'
})
export class DescConfigPresentationalComponent {
  @Input() Ref!: Referential;
}
