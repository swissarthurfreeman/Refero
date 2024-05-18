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


@Component({
  selector: 'app-table',
  styleUrl: './table.component.scss',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {
  @Input() isInjectionMode!: boolean;  // container loads these guys and passes them to the children
  @Input() Ref!: Referential;
  @Input() currView!: View;

  constructor(
    private router: Router, 
    public rs: RefService,
    public es: EntryService,
    private route: ActivatedRoute, 
    private store: Store,
    private cd: ChangeDetectorRef) {}
  

  entries$!: Observable<Record[]>;

  ngOnInit(): void {
    console.log("OnTable Init, Ref :", this.Ref.name);
    this.entries$ = this.es.getEntriesOf(this.Ref.id).pipe(map((entries) => {
      var newEntries: Record[] = [];
      for(let entry of entries) {
        console.log("Read Entry :", entry);
        entry.fields['id'] = entry.id;
        newEntries.push(entry.fields);
      }
      this.cd.detectChanges();
      return newEntries;
    }))
  }

  viewEntry(recId: string) {
    this.router.navigate([`entry/${this.Ref.id}/${recId}`]);
  }

  @Input() EntryForm!: FormArray;
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
