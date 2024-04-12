import { Component, Input, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { Referential } from '../../../../../shared/models/referential.model';
import { View } from '../../../../../shared/models/view.model';

@Component({
  selector: 'app-search',
  standalone: true,       // TODO : remove standalone fuckery, move imports to view feature module.
  imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {

  @Input() Ref!: Referential;
  @Input() simple: boolean = false;
  @Input() currView!: View;
  constructor() {}
}
