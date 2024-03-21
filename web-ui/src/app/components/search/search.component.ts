import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { RefViewService } from '../../service/ref-view.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {

  viewService = inject(RefViewService);

  /*
  @Input()
  refId!: string;
  set RefId(refId: string) {      // get the referential ID from the home component
    this.refId = refId;
  }*/

  RefId = 'REF_OFS_REE_DATA'
  
  constructor() {}

}
