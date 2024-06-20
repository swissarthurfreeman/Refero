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
  SelectSource(srcRef: Referential) {
    this.mappings.clear();
    this.sourceId = srcRef.id;
    for(let injection of this.Ref.injections) {
      if(injection.srcId == srcRef.id) {
        for(let i=0; i < injection.destColIds.length; i++) {
          this.AddMappingToFormArray(injection.destColIds[i], injection.srcColIds[i]);
        }
        break;
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
        raw['mappings'][i]['sourceColId']
      );
      destColIds.push(
        raw['mappings'][i]['destColId']
      );
    }
    
    let injection = new Injection();
    injection.srcId = (raw['SourceRef']! as Referential).id;
    injection.refid = this.Ref.id;
    injection.srcName = this.Ref.name;
    injection.srcColIds = srcColIds;
    injection.destColIds = destColIds;

    console.log("POST :", injection);
    this.is.postInjection(injection).subscribe((value) => {
      window.location.reload();
    })
  }

  UpdateInjection() { // TODO : move to injection service

  }

  RemoveMapping(index: number) {
    console.log("HELLOOO !");
    this.mappings.removeAt(index);
  }
}
