import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, inject } from '@angular/core';
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
import { RefDataService } from '../../service/ref-data.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {

  viewService = inject(RefViewService);
  dataService = inject(RefDataService);

  @Input()
  ParentConfig: any;

  constructor() {}
  ngOnInit(): void {
    console.log("Search Params", this.ParentConfig.RefUid, this.ParentConfig.ViewId);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    this.ParentConfig = changes['ParentConfig'].currentValue;
  }
}
