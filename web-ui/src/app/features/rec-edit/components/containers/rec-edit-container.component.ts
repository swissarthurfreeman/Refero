import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InjectionService } from '../../../../shared/services/injection.service';
import { RefService } from '../../../../shared/services/ref.service';
import { Injection } from '../../../../shared/models/injection.model';
import { Referential } from '../../../../shared/models/referential.model';
import { View } from '../../../../shared/models/view.model';
import { Entry } from '../../../../shared/models/record.model';
import { SetInjection } from '../../../../shared/stores/ref-view/ref-view.action';
import { RecEditState } from '../../../../shared/stores/rec-edit/rec-edit.state';
import { SetInjectionSourceRef, SetInjectionSourceRefView } from '../../../../shared/stores/rec-edit/rec-edit.action';
import { EntryService } from '../../../../shared/services/entry.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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


  SelectInjection(injection: Injection) {
    this.rs.getReferentialBy(injection.srcId).subscribe((SrcRef) => {
      this.store.dispatch([
        new SetInjectionSourceRef(SrcRef),
        new SetInjectionSourceRefView(SrcRef.views[0]),
        new SetInjection(injection)
      ])
    })
  }

  EntryForm: FormGroup = this.fb.group({
    keypairs: this.fb.array([])
  });

  get keypairs() {
    return this.EntryForm.controls["keypairs"] as FormArray;
  }
  
  ngOnInit(): void {
    for(let colfig of this.CurrentRef.columns) {
      const mapForm = this.fb.group({
        colId: [colfig.id],
        value: ['' || this.CurrentEntry.fields[colfig.id]],
      });
      this.keypairs.push(mapForm);
    }
  }

  SaveEntry() {
    // read values from formArray, update CurrentEntry based on it, PUT changes to database.
    for(let keypair of this.EntryForm.getRawValue()['keypairs'])
      this.CurrentEntry.fields[keypair['colId']] = keypair['value']
    
    console.log("PUT :", this.CurrentEntry);
    this.es.putEntry(this.CurrentEntry).subscribe((value) => {
      console.log("PUT response :", value); // TODO : add confirmation popups in the frontend.
    })
  }

  getColNameOf(colId: string): string { // clown shit
    let col = this.CurrentRef.columns.filter((col) => col.id === colId)[0]
    return col.name;
  }
}
