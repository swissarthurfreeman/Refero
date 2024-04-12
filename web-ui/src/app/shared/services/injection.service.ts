import { Injectable, Optional } from '@angular/core';
import { Dict } from '../models/record.model';
import { RefService } from './ref.service';
import { Injection } from '../models/injection.model';

@Injectable({
  providedIn: 'root'
})
export class InjectionService {

  constructor(public rs: RefService) {}

  getInjectionBySource(injections: Dict<Injection>, sourceRef: string): Injection | undefined {
    for(let inj of Object.values(injections)) {
      if(inj.srcId === sourceRef) {
        return inj;
      }
    }
    return undefined;
  }
}
