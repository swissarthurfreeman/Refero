import { Injectable, Optional } from '@angular/core';
import { Dictionary, Referential } from '../models/referential.model';
import { RefService } from './ref.service';
import { Injection } from '../models/injection.model';

@Injectable({
  providedIn: 'root'
})
export class InjectionService {

  constructor(public rs: RefService) {}

  getInjectionBySource(injections: Dictionary<Injection>, sourceRef: string): Injection | undefined {
    for(let inj of Object.values(injections)) {
      if(inj.srcId === sourceRef) {
        return inj;
      }
    }
    return undefined;
  }
}
