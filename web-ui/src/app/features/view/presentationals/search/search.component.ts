import { ChangeDetectorRef, Component, Input, OnInit, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { Referential } from '../../../../shared/models/referential.model';
import { View } from '../../../../shared/models/view.model';
import { RefService } from '../../../../shared/services/ref.service';
import { ColfigService } from '../../../../shared/services/colfig.service';
import { Observable } from 'rxjs';
import { Colfig } from '../../../../shared/models/Colfig.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {

  @Input() Ref!: Referential;
  @Input() isInjectionMode: boolean = false;
  @Input() View!: View;


  constructor(public rs: RefService, public cs: ColfigService, private cd: ChangeDetectorRef) {}

  colfigs$!: Observable<Colfig[]>;

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  rmSearchColId(colId: string) {
    this.View.searchColIds.splice(this.View.searchColIds.indexOf(colId), 1);
  }
}
