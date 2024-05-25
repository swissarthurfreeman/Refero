import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InjectionService } from '../../../../shared/services/injection.service';
import { RefService } from '../../../../shared/services/ref.service';
import { Injection } from '../../../../shared/models/injection.model';
import { Referential } from '../../../../shared/models/referential.model';
import { View } from '../../../../shared/models/view.model';
import { Entry, Record } from '../../../../shared/models/record.model';
import { SetInjection } from '../../../../shared/stores/ref-view/ref-view.action';
import { RecEditState } from '../../../../shared/stores/rec-edit/rec-edit.state';
import { SetInjectionSourceRef, SetInjectionSourceRefView } from '../../../../shared/stores/rec-edit/rec-edit.action';
import { EntryService } from '../../../../shared/services/entry.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Colfig } from '../../../../shared/models/Colfig.model';


@Component({
  selector: 'app-rec-edit-container',
  templateUrl: './rec-edit-container.component.html',
  styleUrl: './rec-edit-container.component.scss'
})
export class RecEditContainerComponent implements OnInit {
  constructor(public rs: RefService, public es: EntryService, public is: InjectionService, public store: Store, private fb: FormBuilder) {}

  @Input() CurrentEntry!: Entry;
  @Input() CurrentRef!: Referential;

  @Select(RecEditState.getInjectionSourceRef) SourceRef$!: Observable<Referential>;
  @Select(RecEditState.getInjectionSourceRefView) SourceRefView$!: Observable<View>;

  EntryForm!: FormGroup;

  ngOnInit(): void {
    this.EntryForm = this.fb.group({
      keypairs: this.fb.array([])
    });
    this.AddKeyPairs();
    this.EntryForm.markAllAsTouched();
    this.EntryForm.markAsDirty();
    this.EntryForm.markAsTouched();
  }

  get keypairs() {
    return this.EntryForm.controls["keypairs"] as FormArray;
  }
  
  AddKeyPairs() {
    for(let colfig of this.CurrentRef.columns) {
      if(colfig.name === "STATUS")
        console.log(this.CurrentEntry, colfig);

      const mapForm = this.fb.group({
        colId: colfig.id,
        value: this.CurrentEntry.fields[colfig.id],
      });
      mapForm.controls.colId.markAsTouched();
      mapForm.markAsTouched();
      this.keypairs.push(mapForm);
    }
  }

  ErrorMap: Record = {};

  SaveEntry() {
    // read values from formArray, update CurrentEntry based on it, PUT changes to database.
    for(let keypair of this.EntryForm.getRawValue()['keypairs'])
      this.CurrentEntry.fields[keypair['colId']] = keypair['value']
    
    console.log("PUT :", this.CurrentEntry);
    this.es.putEntry(this.CurrentEntry).subscribe({
      next: (value) => console.log("PUT :", value) ,
      error: (error) => { 
        let jsonEntryError: Record = JSON.parse(error.error.message);
        this.ErrorMap = jsonEntryError;
        console.log("error message :", jsonEntryError)
      }
    })
  }

  SelectInjection(injection: Injection) {
    this.rs.getReferentialBy(injection.srcId).subscribe((SrcRef) => {
      this.store.dispatch([
        new SetInjectionSourceRef(SrcRef),
        new SetInjectionSourceRefView(SrcRef.views[0]),
        new SetInjection(injection)
      ])
    })
  }
}
