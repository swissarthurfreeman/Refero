import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { RefDataService } from '../../service/ref-data.service';
import { Referential } from '../../model/referential.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  dataService = inject(RefDataService);

  @Input() RefUid!: string;
  Ref!: Referential;
  
  constructor() {}
  ngOnInit(): void {
    this.Ref = this.dataService.getRefDataBy(this.RefUid);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    console.log("Search Changes :", changes)
    this.Ref = this.dataService.getRefDataBy(this.RefUid);
  }
}
