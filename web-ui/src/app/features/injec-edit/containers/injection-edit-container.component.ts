import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { RefService } from '../../../shared/services/ref.service';
import { InjectionService } from '../../../shared/services/injection.service';
import { Referential } from '../../../shared/models/referential.model';
import { Injection } from '../../../shared/models/injection.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-injection-edit-container',
  templateUrl: './injection-edit-container.component.html'
})
export class InjectionEditContainerComponent implements OnInit {
  constructor(private fb: FormBuilder, public rs: RefService, public is: InjectionService) {}
  @Input() Ref!: Referential;
  refs$!: Observable<Referential[]>;

  InjectionConfigForm: FormGroup = this.fb.group({
    SourceRef: this.fb.control(''),
    mappings: this.fb.array([])
  });

  ngOnInit() {
    this.refs$ = this.rs.getReferentials();
    this.mappings.clear();
  }

  sourceId: string = '';
  
  // we clearly need a current injection state in the ref-config-edit store
  // select 
  SelectSource(sourceId: string) {
    this.mappings.clear();
    this.sourceId = sourceId; // also needs to update the form to injection if it's already defined
    let inj: Injection | undefined = this.is.getInjectionBySource(this.Ref.injections, sourceId);
    if (inj != undefined) {
      for(let i=0; i < inj.destColIds.length; i++) {
        this.AddMappingToFormArray(inj.destColIds[i], inj.srcColIds[i]);
      }
    }    
  }

  AddMappingToFormArray(destColId?: string, sourceColId?: string) {
    const MapForm = this.fb.group({
      destColId: [destColId || ''],
      sourceColId: [sourceColId || '']
    });
    this.mappings.push(MapForm);
  }

  get mappings() {
    return this.InjectionConfigForm.controls['mappings'] as FormArray;
  }

  CreateInjection() { // TODO : move to injection service
    let raw: any = this.InjectionConfigForm.getRawValue();

    let srcColIds = [];
    let destColIds = [];
    for(let i=0; i < raw['mappings'].length; i++) {
      srcColIds.push(
        raw['mappings'][i]['SourceCol']
      );
      destColIds.push(
        raw['mappings'][i]['DestCol']
      );
    }
    
    let injection = new Injection();
    injection.srcId = raw['SourceRef']! as string;
    injection.ref_id = this.Ref.id;
    injection.srcName = this.Ref.name;
    injection.srcColIds = srcColIds;
    injection.destColIds = destColIds;

    console.log("Injection to Create :", injection);
    this.is.postInjection(injection).subscribe((value) => {
      console.log("Created new Injection : ", value);
      this.Ref.injections.push(value);    // BUG : we should be re-getting referentials instead 
    })
  }

  UpdateInjection() { // TODO : move to injection service

  }

  RemoveMapping(index: number) {
    console.log("HELLOOO !");
    this.mappings.removeAt(index);
  }
}
