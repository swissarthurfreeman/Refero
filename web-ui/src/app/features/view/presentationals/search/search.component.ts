import {ChangeDetectorRef, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Referential} from '../../../../shared/models/referential.model';
import {View} from '../../../../shared/models/view.model';
import {RefService} from '../../../../shared/services/ref.service';
import {ColfigService} from '../../../../shared/services/colfig.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Store} from '@ngxs/store';
import {SetSearchFilterValue} from '../../../../shared/stores/ref-view/ref-view.action';

export interface SearchFilter {
  searchFieldValue: FormControl<string | null>;
}

export interface SearchForm {
  searchFieldFilters: FormArray<FormGroup<SearchFilter>>;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  constructor(public store: Store, public rs: RefService, public cs: ColfigService, private cd: ChangeDetectorRef, private fb: FormBuilder) {
  }

  @Input() Ref!: Referential;
  @Input() isInjectionMode: boolean = false;
  @Input() View!: View;

  searchFormGroup!: FormGroup<SearchForm>;

  filter: any = {};

  ngOnChanges(changes: SimpleChanges) {
    console.log("Search Changes :", changes);
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.store.dispatch(new SetSearchFilterValue('')).subscribe(() => {
        this.searchFormGroup = new FormGroup<SearchForm>({
          searchFieldFilters: new FormArray<FormGroup<SearchFilter>>([])
        });

        for (let colfig of this.Ref.columns) {
          const SearchFilterFormGroup: FormGroup<SearchFilter> = new FormGroup<SearchFilter>({
            searchFieldValue: new FormControl('')
          });

          SearchFilterFormGroup.valueChanges.subscribe((filterValue) => {
            this.filter[colfig.id] = filterValue.searchFieldValue;
            //console.log("Dispatch =", this.filter);                                     // emitted to table component to do filtering.
            this.store.dispatch(new SetSearchFilterValue(JSON.stringify(this.filter))); // stringify because DataSource.filter is a string
          })

          this.searchFormGroup.controls.searchFieldFilters.push(SearchFilterFormGroup);
        }
      }
    )
    this.cd.detectChanges();
  }

  rmSearchColId(colId: string) {
    this.View.searchcolids.splice(this.View.searchcolids.indexOf(colId), 1);
  }
}
