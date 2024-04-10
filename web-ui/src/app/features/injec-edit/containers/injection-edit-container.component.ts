import { Component, Input, OnInit } from '@angular/core';
import { Dictionary, Referential } from '../../../shared/models/referential.model';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Injection } from '../../../shared/models/injection.model';
import { RefService } from '../../../shared/services/ref.service';

@Component({
  selector: 'app-injection-edit-container',
  templateUrl: './injection-edit-container.component.html'
})
export class InjectionEditContainerComponent implements OnInit {
  constructor(private fb: FormBuilder, public rs: RefService) {}
  @Input() Ref!: Referential;

  InjectionConfigForm: FormGroup = this.fb.group({
    SourceRef: this.fb.control(''),
    mappings: this.fb.array([])
  });

  ngOnInit() {}

  AddMappingToFormArray() {
    const MapForm = this.fb.group({
      DestCol: [''],
      SourceCol: ['']
    });
    this.mappings.push(MapForm);
  }

  get mappings() {
    return this.InjectionConfigForm.controls['mappings'] as FormArray;
  }

  sourceId: string = '';

  SelectSource(sourceId: string) {
    this.sourceId = sourceId;
  }

  CreateInjection() { // TODO : move to injection service
    let raw: Dictionary<Array<Dictionary<string>> | string> = this.InjectionConfigForm.getRawValue();
    let srcColIds = [];
    let destColIds = [];
    for(let i=0; i < (raw['mappings'] as Array<Dictionary<string>>).length; i++) {
      srcColIds.push((raw['mappings'][i] as Dictionary<string>)['SourceCol']);
      destColIds.push((raw['mappings'][i] as Dictionary<string>)['DestCol']);
    }
    
    let injection = new Injection(
      raw['SourceRef'] as string,
      srcColIds,
      this.Ref.uid,
      destColIds
    )

    this.Ref.addInjection(injection);

    //this.location.back();
    console.log(this.Ref);
  }
}
