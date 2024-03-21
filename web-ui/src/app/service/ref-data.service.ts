import { Injectable } from '@angular/core';
import { Referential } from '../model/referential.model';
import * as jsonRefOfsReeData from '../../assets/mock-data/REF_OFS_REE_DATA.json'
import * as jsonRefOfsReeStatut from '../../assets/mock-data/REF_OFS_REE_STATUT.json'
import * as jsonRefOfsReeType from '../../assets/mock-data/REF_OFS_REE_TYPE.json'

@Injectable({
  providedIn: 'root'
})
export class RefDataService {

  constructor() {
    this._refData = [
      new Referential("REF_OFS_REE_DATA", "Entrées du REE des Entitées de l'Université de Genève", (jsonRefOfsReeData as any).default),
      new Referential("REF_OFS_REE_STATUT", "Définitions des status d'une entité REE de l'OFS", (jsonRefOfsReeStatut as any).default),
      new Referential("REF_OFS_REE_TYPE", "Définitions des types d'entité REE de l'OFS", (jsonRefOfsReeType as any).default)
    ];
  }

  private _refData: Array<Referential>;

  getRefDataBy(refId: string): Referential {
    let ref = this._refData.find(ref => ref.id == refId)!;
    return ref
  }

  getRefs(): Array<Referential> {
    return this._refData;
  }
}
