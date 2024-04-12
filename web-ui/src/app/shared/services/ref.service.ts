import { Injectable } from '@angular/core';
import { Referential } from '../models/referential.model';
import { Dict } from '../models/record.model';
import * as jsonRefOfsReeData from '../../../assets/mock-data/REF_OFS_REE_DATA.json'
import * as jsonRefOfsReeStatut from '../../../assets/mock-data/REF_OFS_REE_STATUT.json'
import * as jsonRefOfsReeType from '../../../assets/mock-data/REF_OFS_REE_TYPE.json'
import { ViewService } from './view.service';

@Injectable({
  providedIn: 'root'
})
export class RefService {

  constructor(public vs: ViewService) {
    let refData = new Referential("REF_OFS_REE_DATA", "Entrées du REE des Entitées de l'Université de Genève", 
      (jsonRefOfsReeData as any).default, Object.keys ( (jsonRefOfsReeData as any).default[0]), "4bda5c19-0155-4a27-905c-bb84b301ac37");

    vs.createDefaultViewFor(refData);    

    let refStat = new Referential("REF_OFS_REE_STATUT", "Définitions des status d'une entité REE de l'OFS", 
      (jsonRefOfsReeStatut as any).default, Object.keys ( (jsonRefOfsReeStatut as any).default[0]));

    vs.createDefaultViewFor(refStat);

    let refType = new Referential("REF_OFS_REE_TYPE", "Définitions des types d'entité REE de l'OFS", 
      (jsonRefOfsReeType as any).default, Object.keys ( (jsonRefOfsReeType as any).default[0]));

    vs.createDefaultViewFor(refType);

    this._refData = new Map<string, Referential>();
    this._refData.set(refData.id, refData);
    this._refData.set(refStat.id, refStat);
    this._refData.set(refType.id, refType);
  }

  private _refData: Dict<Referential>;

  getRefDataBy(refId: string): Referential {
    return this._refData.get(refId)!;
  }

  getRefs(): Array<Referential> {
    return Array.from(this._refData.values());
  }

  createRef(newRef: Referential) {
    this._refData.set(newRef.id, newRef);
  }
}
