import { Component, Input, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import { Observable } from 'rxjs';
import { Colfig } from '../../../../../shared/models/Colfig.model';
import { ColfigService } from '../../../../../shared/services/colfig.service';
import { Entry, Record } from '../../../../../shared/models/record.model';
import { EntryService } from '../../../../../shared/services/entry.service';
import {KeyPairFormGroup} from "../../containers/rec-edit-container.component";

@Component({
  selector: 'app-key-value-presentational',
  templateUrl: './key-value-presentational.component.html',
  styleUrl: './key-value-presentational.component.scss'
})
export class KeyValuePresentationalComponent {
  constructor(private cs: ColfigService, private es: EntryService) {}

  colfig$!: Observable<Colfig>;
  foreignEntries$!: Observable<Entry[]>;

  ngOnInit(): void {
    this.colfig$ = this.cs.getColfigBy(this.KeyPairFormGroup.controls.colId.getRawValue());
    this.colfig$.subscribe((colfig) => {
      if(colfig.coltype === 'FK') {
        console.log("Getting Entries of Foreign Ref with ID", colfig.pointedrefid);
        this.foreignEntries$ = this.es.getEntriesOf(colfig.pointedrefid);
        this.foreignEntries$.subscribe(() => {});
      }
    })
  }

  @Input() KeyPairFormGroup!: FormGroup<KeyPairFormGroup>; // contains colId and value
  @Input() KeyPairError!: string;
  @Input() readOnly: boolean = false;

  getForeignLabelFor(e: Entry, withColIds: string[]): string {
    let label: string = "";
    for(let colId of withColIds) {
      label += e.fields[colId] + ", ";
    }
    return label;
  }
}
