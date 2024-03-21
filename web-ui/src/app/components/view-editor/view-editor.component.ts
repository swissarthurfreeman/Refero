import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import { RefViewService } from '../../service/ref-view.service';

@Component({
  selector: 'app-view-editor',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  templateUrl: './view-editor.component.html'
})
export class ViewEditorComponent {
  constructor() {}
  viewService = inject(RefViewService);

  /*
  @Input()
  refId!: string;
  set RefId(refId: string) {      // get the referential ID from the home component
    this.refId = refId;
  }
  */
  RefId: string = 'REF_OFS_REE_DATA';
  viewId: string = 'DEFAULT_VIEW';
}


