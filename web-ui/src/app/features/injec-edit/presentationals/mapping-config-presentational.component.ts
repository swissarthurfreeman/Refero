import { Component, Input, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import { RefService } from '../../../shared/services/ref.service';
import { Referential } from '../../../shared/models/referential.model';
import { Observable } from 'rxjs';
import {InjectionConfig, MappingConfig} from "../containers/injection-edit-container.component";
import {Injection} from "../../../shared/models/injection.model";

@Component({
  selector: 'app-mapping-config-presentational',
  templateUrl: './mapping-config-presentational.component.html'
})
export class MappingConfigPresentationalComponent {
  @Input() InjectionConfigFormGroup!: FormGroup<InjectionConfig>;
  @Input() MappingConfigFormGroup!: FormGroup<MappingConfig>; // base FormArray control of injection-edit input.
  @Input() destRef!: Referential;
  @Input() srcRef!: Referential;             // id of source referential in select.
  @Input() currInjection!: Injection;

  // update this to remove from list of destColIds in other mappings
  addMappingToInjection(destColId: string){
    this.currInjection.mappings = {};
    for(let mapping of this.InjectionConfigFormGroup.controls.mappings.controls) {
      this.currInjection.mappings[mapping.controls.destColId.getRawValue()] = mapping.controls.srcColId.getRawValue();
    }
  }

  destColInInjectionFormGroupConfig(destColId: string): boolean {
    for(let mapping of this.InjectionConfigFormGroup.controls.mappings.controls) {
      if(mapping.controls.destColId.getRawValue() === destColId) {
        return true;
      }
    }
    return false;
  }

  destColIdBelongsToThisKeyPair(destColId: string): boolean {
    return this.MappingConfigFormGroup.controls.destColId.getRawValue() == destColId;
  }
}
