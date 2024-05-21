import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Colfig } from '../../../../../shared/models/Colfig.model';
import { ColfigService } from '../../../../../shared/services/colfig.service';
import { Entry } from '../../../../../shared/models/record.model';
import { EntryService } from '../../../../../shared/services/entry.service';

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
    this.colfig$ = this.cs.getColfigBy(this.colId);
    this.colfig$.subscribe((colfig) => {
      if(colfig.colType === 'FK') {
        this.foreignEntries$ = this.es.getEntriesOf(colfig.ref_id);
      }
    })
  }
  
  @Input() colId!: string;   
  @Input() FormControl!: FormControl; // contains colId and value


}
