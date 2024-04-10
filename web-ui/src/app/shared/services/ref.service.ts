import { Injectable } from '@angular/core';
import { Dictionary, Referential } from '../models/referential.model';
import * as jsonRefOfsReeData from '../../../assets/mock-data/REF_OFS_REE_DATA.json'
import * as jsonRefOfsReeStatut from '../../../assets/mock-data/REF_OFS_REE_STATUT.json'
import * as jsonRefOfsReeType from '../../../assets/mock-data/REF_OFS_REE_TYPE.json'

@Injectable({
  providedIn: 'root'
})
export class RefService {

  constructor() {
    let refData = new Referential("REF_OFS_REE_DATA", "Entrées du REE des Entitées de l'Université de Genève", 
      (jsonRefOfsReeData as any).default, Object.keys ( (jsonRefOfsReeData as any).default[0]), "4bda5c19-0155-4a27-905c-bb84b301ac37");
    let refStat = new Referential("REF_OFS_REE_STATUT", "Définitions des status d'une entité REE de l'OFS", 
      (jsonRefOfsReeStatut as any).default, Object.keys ( (jsonRefOfsReeStatut as any).default[0]));
    let refType = new Referential("REF_OFS_REE_TYPE", "Définitions des types d'entité REE de l'OFS", 
      (jsonRefOfsReeType as any).default, Object.keys ( (jsonRefOfsReeType as any).default[0]));
    
    this._refData = {};
    this._refData[refData.uid] = refData;
    this._refData[refStat.uid] = refStat;
    this._refData[refType.uid] = refType;
  }

  private _refData: Dictionary<Referential>;

  getRefDataBy(uid: string): Referential {
    return this._refData[uid];
  }

  getRefs(): Array<Referential> {
    return Object.values(this._refData);
  }

  createRef(newRef: Referential) {
    this._refData[newRef.uid] = newRef;
    // TODO: POST newRef to the backend
  }

  updateRef(ref: Referential) {
    // TODO : PUT Ref to backend, will probably
    // also need a method to update records
  }
}
