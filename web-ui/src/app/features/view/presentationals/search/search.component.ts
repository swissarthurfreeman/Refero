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
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { SetSearchFilterValue } from '../../../../shared/stores/ref-view/ref-view.action';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {

  @Input() Ref!: Referential;
  @Input() isInjectionMode: boolean = false;
  @Input() View!: View;


  constructor(public store: Store, public rs: RefService, public cs: ColfigService, private cd: ChangeDetectorRef, private fb: FormBuilder) {}

  searchFormGroup = this.fb.group({
    searchFields: this.fb.array([])
  });

  get searchFields() {
    return this.searchFormGroup.controls["searchFields"] as FormArray;
  }

  filter: any = {};

  ngOnInit(): void {
    for(let colfig of this.Ref.columns) {
      const fc = this.fb.group({
        filterValue: ''
      })

      fc.valueChanges.subscribe((filterValue) => {
        this.filter[colfig.id] = filterValue.filterValue?.toLowerCase();                 // TODO : make this cleaner, formGroups are a mess
        console.log("Dispatch =", this.filter);                           // this value needs to be emitted to the table component for it to update
        this.store.dispatch(new SetSearchFilterValue(JSON.stringify(this.filter))); // we stringify because DataSource.filter is a string...
      })

      this.searchFields.push(fc);
    }
    this.cd.detectChanges();
  }

  rmSearchColId(colId: string) {
    this.View.searchcolids.splice(this.View.searchcolids.indexOf(colId), 1);
  }
}
