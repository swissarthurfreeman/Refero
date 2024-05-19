import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, map } from 'rxjs';
import { Referential } from '../../../../shared/models/referential.model';
import { RefService } from '../../../../shared/services/ref.service';
import { Injection } from '../../../../shared/models/injection.model';
import { View } from '../../../../shared/models/view.model';
import { EntryService } from '../../../../shared/services/entry.service';
import { Entry, Record } from '../../../../shared/models/record.model';
import { RefViewState } from '../../../../shared/stores/ref-view/ref-view.state';
import { FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-table',
  styleUrl: './table.component.scss',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {
  @Input() isInjectionMode!: boolean;  // container loads these guys and passes them to the children
  @Input() Ref!: Referential;
  @Input() currView!: View;

  constructor(private router: Router, public rs: RefService, public es: EntryService,
    private route: ActivatedRoute, private store: Store, private cd: ChangeDetectorRef) {}
  
  dataSource = new MatTableDataSource<Record>();
  entries$!: Observable<Record[]>;

  @Select(RefViewState.getSearchFilterValue) SearchFilterValue$!: Observable<string>;

  ngOnInit(): void {
    this.entries$ = this.es.getEntriesOf(this.Ref.id).pipe(map((entries) => {
      var newEntries: Record[] = [];
      for(let entry of entries) {
        entry.fields['id'] = entry.id;
        newEntries.push(entry.fields);
      }
      this.cd.detectChanges();
      return newEntries;
    }))

    this.entries$.subscribe((records) => {
      this.dataSource.data = records;
    });

    this.SearchFilterValue$.subscribe((filterValue) => {
      this.dataSource.filter = filterValue;
    })
    // this.dataSource.filter = JSON.stringify(this.currView.filterValue); // subscribe to filterValue from store
    this.dataSource.filterPredicate = this.tableFilter();
  }

  tableFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data: any, filter: any): boolean {
      console.log("Call filterFunction");
      let searchTerms = JSON.parse(filter); // will be {colId: value...}
      let result = true;
      console.log("data =", data, "\nfilter =", filter);  // data is single {colId: value}
      for(let colId of Object.keys(searchTerms)) {
        result = result && ( data[colId].toLowerCase().indexOf(searchTerms[colId]) !== -1 )
      }
      return result;
    }
    return filterFunction;
  }

  viewEntry(recId: string) {
    this.router.navigate([`entry/${this.Ref.id}/${recId}`]);
  }

  @Input() EntryForm!: FormArray; // will be null if in view mode, will be the Entry formarray if viewing an entry (for injection)
  @Input() CurrentEntry!: Entry;  // optional for injection, used if simple mode is on. 
  @Select(RefViewState.getInjection) Injection$!: Observable<Injection>;
  
  applyInjection(srcRec: Record, Injection: Injection) {        // TODO : this code can be made more readable no ? 
    for(let control of this.EntryForm.controls) {
      let keypair = control.getRawValue();
      for(let i=0; i < Injection.destColIds.length; i++) {
        console.log(keypair['colId'], Injection.destColIds[i])
        if (keypair['colId'] === Injection.destColIds[i]) {         // TODO : update the corresponding FormArray here...
          console.log("Inject =", srcRec[Injection.srcColIds[i]]);
          
          control.setValue({colId: Injection.destColIds[i], value: srcRec[Injection.srcColIds[i]]})
          //this.CurrentEntry.fields[Injection.destColIds[i]] = srcRec[Injection.srcColIds[i]];
        }
      }
    }
  } 

  rmDispColId(colId: string) {
    this.currView.dispColIds.splice(this.currView.dispColIds.indexOf(colId), 1);
  }
}
