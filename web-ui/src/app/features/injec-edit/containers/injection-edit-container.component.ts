import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {RefService} from '../../../shared/services/ref.service';
import {InjectionService} from '../../../shared/services/injection.service';
import {Referential} from '../../../shared/models/referential.model';
import {Injection} from '../../../shared/models/injection.model';
import {v4 as uuid} from 'uuid';

export interface MappingConfig {
  srcColId: FormControl<string>
  destColId: FormControl<string>
}

export interface InjectionConfig {
  srcid: FormControl<string>,
  mappings: FormArray<FormGroup<MappingConfig>>
}

@Component({
  selector: 'app-injection-edit-container',
  templateUrl: './injection-edit-container.component.html'
})
export class InjectionEditContainerComponent implements OnInit {
  constructor(private fb: FormBuilder, public rs: RefService, public is: InjectionService) {
  }

  @Input() Ref!: Referential;
  @Input() Refs!: Referential[];

  InjectionConfigFormGroup!: FormGroup<InjectionConfig>;

  ngOnInit() {
    this.ResetInjectionConfigForm();
  }
  sourceRef!: Referential;

  ResetInjectionConfigForm() {
    this.InjectionConfigFormGroup = new FormGroup<InjectionConfig>({
      srcid: new FormControl('', {nonNullable: true}),
      mappings: new FormArray<FormGroup<MappingConfig>>([])
    })
  }

  /**
   * Select source referential to create or update the injection for. If no injection
   * is yet defined, the mapping form array is not populated.
   * @param srcid the id of the source referential from the which to inject records.
   */
  SelectSource(srcid: string) {
    this.ResetInjectionConfigForm();    // clear previous injection if needed
    this.InjectionConfigFormGroup.controls.srcid.setValue(srcid); // reset srcid

    this.sourceRef = this.getRefById(srcid);
    console.log("Select", this.sourceRef);

    this.currInjection = new Injection();

    for (let injection of this.Ref.injections) {
      if (injection.srcid == this.sourceRef.id) {
        this.currInjection = injection;
        for (let destColId of Object.keys(injection.mappings)) {
          this.AddMappingFormGroupToFormArray(destColId, injection.mappings[destColId]!);
        }
        return;
      }
    }
  }

  getRefById(refId: string): Referential {
    console.log(this.Refs);
    for(let ref of this.Refs) {
      if(ref.id === refId)
        return ref;
    }
    return new Referential();
  }

  AddMappingFormGroupToFormArray(destColId: string, srcColId: string) {
    if(this.currInjection.id == undefined) {
      this.currInjection.id = uuid().toString();
    }

    const MapFormGroup = new FormGroup<MappingConfig>({
      srcColId: new FormControl(srcColId, {nonNullable: true}),
      destColId: new FormControl(destColId, {nonNullable: true})
    })
    this.InjectionConfigFormGroup.controls.mappings.push(MapFormGroup);
  }

  currInjection: Injection = new Injection();

  CreateInjection() {

    this.currInjection.srcid = this.InjectionConfigFormGroup.controls.srcid.getRawValue();
    this.currInjection.srcname = this.sourceRef.name;
    this.currInjection.refid = this.Ref.id;
    this.currInjection.mappings = {};

    for (let mappingForm of this.InjectionConfigFormGroup.controls.mappings.controls) {
      console.log(mappingForm.controls);
      this.currInjection.mappings[mappingForm.controls.destColId.getRawValue()] = mappingForm.controls.srcColId.getRawValue();
    }

    console.log("PUT :", this.currInjection);
    this.is.putInjection(this.currInjection.id, this.currInjection).subscribe((value) => {
      console.log("PUTTED :", value);
      window.location.reload();
    });
  }

  RemoveMapping(index: number) {
    this.InjectionConfigFormGroup.controls.mappings.removeAt(index);
  }

  HasInjectionTowardsDest(srcRef: Referential) {
    for(let inj of this.Ref.injections) {
      if(inj.srcid === srcRef.id) {
        return true;
      }
    }
    return false;
  }

  DeleteInjection() {
    this.is.deleteInjection(this.currInjection.id).subscribe(() => {
      window.location.reload();
    });
  }
}
