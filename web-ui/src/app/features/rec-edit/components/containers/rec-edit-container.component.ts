import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {InjectionService} from '../../../../shared/services/injection.service';
import {RefService} from '../../../../shared/services/ref.service';
import {Injection} from '../../../../shared/models/injection.model';
import {Referential} from '../../../../shared/models/referential.model';
import {View} from '../../../../shared/models/view.model';
import {Entry, Record} from '../../../../shared/models/record.model';
import {RecEditState} from '../../../../shared/stores/rec-edit/rec-edit.state';
import {
  SetInjection,
  SetInjectionMode,
  SetInjectionSourceRef,
  SetInjectionSourceRefView,
} from '../../../../shared/stores/rec-edit/rec-edit.action';
import {EntryService} from '../../../../shared/services/entry.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Location} from '@angular/common';


export interface KeyPairFormGroup {
  colId: FormControl<string>,
  value: FormControl<string | null>
}

export interface EntryFormGroup {
  keypairs: FormArray<FormGroup<KeyPairFormGroup>>;
}

@Component({
  selector: 'app-rec-edit-container',
  templateUrl: './rec-edit-container.component.html',
  styleUrl: './rec-edit-container.component.scss'
})
export class RecEditContainerComponent implements OnInit {
  constructor(
    public rs: RefService, public es: EntryService, public is: InjectionService,
    public store: Store, private fb: FormBuilder, private location: Location,
    private cd: ChangeDetectorRef) {
  }

  @Input() CurrentEntry!: Entry;
  @Input() CurrentRef!: Referential;

  @Select(RecEditState.getInjectionSourceRef) SourceRef$!: Observable<Referential>;
  @Select(RecEditState.getInjectionSourceRefView) SourceRefView$!: Observable<View>;

  EntryFormGroup!: FormGroup<EntryFormGroup>;

  SelectInjection(injection: Injection) {
    this.rs.getReferentialBy(injection.srcid).subscribe((SourceRef) => {
      this.store.dispatch([
        new SetInjectionMode(true),
        new SetInjection(injection),
        new SetInjectionSourceRef(SourceRef),
        new SetInjectionSourceRefView(SourceRef.views[0]),
      ]);
    });
  }

  ngOnInit(): void {
    this.EntryFormGroup = new FormGroup<EntryFormGroup>({
      keypairs: new FormArray<FormGroup<KeyPairFormGroup>>([])
    });
    this.AddKeyPairs();
  }

  AddKeyPairs() {
    for (let colfig of this.CurrentRef.columns) {
      const keypairFormGroup = new FormGroup<KeyPairFormGroup>({
        colId: new FormControl(colfig.id, {nonNullable: true}),
        value: new FormControl(this.CurrentEntry.fields[colfig.id]),
      });
      this.EntryFormGroup.controls.keypairs.push(keypairFormGroup);
    }
  }

  EntryErrorMap: Record = {};

  SaveEntry() {
    this.EntryErrorMap = {};      // reset error map.
    for (let keypair of this.EntryFormGroup.controls.keypairs.controls)
      this.CurrentEntry.fields[keypair.controls.colId.getRawValue()] = keypair.controls.value.getRawValue() || '';

    this.es.putEntry(this.CurrentEntry.id, this.CurrentEntry).subscribe({
      next: (value) => console.log("PUTTED :", value),
      error: (httpError) => {
        console.log("error :", httpError)
        for (let colId of Object.keys(httpError.error.fields)) {
          this.EntryErrorMap[colId] = httpError.error.fields[colId];
        }
      }
    })
  }

  DeleteEntry() {
    this.es.delEntry(this.CurrentEntry.id).subscribe(() => {
      this.location.back();
    });
  }
}
