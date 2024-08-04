import {ChangeDetectorRef, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {map, Observable} from 'rxjs';
import {Referential} from '../../../../shared/models/referential.model';
import {RefService} from '../../../../shared/services/ref.service';
import {Injection} from '../../../../shared/models/injection.model';
import {View} from '../../../../shared/models/view.model';
import {EntryService} from '../../../../shared/services/entry.service';
import {Entry, Record} from '../../../../shared/models/record.model';
import {RefViewState} from '../../../../shared/stores/ref-view/ref-view.state';
import {FormArray, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {RecEditState} from "../../../../shared/stores/rec-edit/rec-edit.state";
import {
  KeyPairFormGroup
} from "../../../rec-edit/components/containers/rec-edit-container.component";


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
              private route: ActivatedRoute, private store: Store, private cd: ChangeDetectorRef) {
  }

  dataSource!: MatTableDataSource<Record>;
  entries$!: Observable<Record[]>;

  @Select(RefViewState.getSearchFilterValue) SearchFilterValue$!: Observable<string>;

  ngOnChanges(changes: SimpleChanges) {
    //console.log("Table changes :", changes);
    this.ngOnInit();
  }

  ngOnInit(): void {

    this.entries$ = this.es.getEntriesOf(this.Ref.id).pipe(map((entries) => {
      const newEntries: Record[] = [];
      for (let entry of entries) {
        entry.fields['id'] = entry.id;
        newEntries.push(entry.fields);
      }
      return newEntries;
    }));

    // TODO : we need to trigger ngOnInit whenever we swap referential. We may have to select
    // state inside the table.
    this.entries$.subscribe((records) => {
      this.dataSource = new MatTableDataSource<Record>(records);
      this.dataSource.data = records;

      this.SearchFilterValue$.subscribe((filterValue) => {
        //console.log("Here :", filterValue, this.dataSource);
        this.dataSource.filter = filterValue || '';
        this.dataSource.filterPredicate = this.tableFilter();
      })
    });
  }

  tableFilter(): (data: any, filter: string) => boolean { // very simple filter implementation, this can be bettered with a whole syntax if needs be
    return function (data: any, filter: any): boolean {
      let searchTerms = JSON.parse(filter);               // will be {colId: value...}
      let result = true;
      //console.log("data =", data, "\nfilter =", filter);  // data is an Entry {colId: value...}
      for (let colId of Object.keys(searchTerms)) {
        if (data[colId] === undefined) continue; // TODO : figure out why this is happening, why is there an empty line ??
        result = result && ((data[colId] as string).toLowerCase().indexOf(searchTerms[colId]) !== -1)
      }
      return result;
    };
  }

  viewEntry(recId: string) {
    this.router.navigate([`entry/${this.Ref.id}/${recId}`]);
  }

  @Input() EntryFormGroupToInjectTo!: FormArray<FormGroup<KeyPairFormGroup>>; // will be null if in view mode, will be the Entry formarray if viewing an entry (for injection)
  @Input() CurrentEntry!: Entry;  // optional for injection, used if injection mode is on.
  @Select(RecEditState.getInjection) Injection$!: Observable<Injection>;

  applyInjection(srcRec: Record, inj: Injection) {        // TODO : this code can be made more readable no ?
    console.log(this.EntryFormGroupToInjectTo, srcRec);
    for (const entryToInjectToKeyPairFormGroup of this.EntryFormGroupToInjectTo.controls) {
      const destColId: string = entryToInjectToKeyPairFormGroup.controls.colId.getRawValue();

      if (Object.keys(inj.mappings).indexOf(destColId) != -1) {  // if keypair colid is a destination column of the injection
        entryToInjectToKeyPairFormGroup.controls.value.setValue(srcRec[inj.mappings[destColId]]);
      }
    }
  }

  rmDispColId(colId: string) {
    this.currView.dispcolids.splice(this.currView.dispcolids.indexOf(colId), 1);
  }

  exportTable() {
    let csv = "";
    let header = "";
    for (let colId of this.currView.dispcolids) {
      for (let colfig of this.Ref.columns) {
        if (colfig.id === colId) {
          header += '"' + colfig.name + '",';
        }
      }
    }
    header = header + '\n'
    csv += header;

    // since columnIds are not human readable, we have to manually replace them...
    for (let record of this.dataSource.data) {
      let line = "";
      for (let colId of this.currView.dispcolids) {
        line += '"' + record[colId] + '",'
      }
      line += '\n';
      csv += line;
    }

    let blob = new Blob([csv], {type: 'text/plain'});

    var link = document.createElement('a');
    link.download = this.Ref.name.replaceAll(' ', '_') + '.csv';
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }
}
