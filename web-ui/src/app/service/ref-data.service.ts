import { Injectable } from '@angular/core';
import { Referential } from '../model/referential.model';
import * as jsonRefOfsReeData from '../../assets/mock-data/REF_OFS_REE_DATA.json'
import * as jsonRefOfsReeStatut from '../../assets/mock-data/REF_OFS_REE_STATUT.json'
import * as jsonRefOfsReeType from '../../assets/mock-data/REF_OFS_REE_TYPE.json'
import { v4 as uuidv4 } from 'uuid';

interface Dictionary<T> {
  [Key: string]: T;
}

@Injectable({
  providedIn: 'root'
})
export class RefDataService {

  getHeaderConfig(line: Array<string>): Dictionary<string> {
    let headerConfig: Dictionary<string> = {}
    for (let colName of line) {
      headerConfig[uuidv4()] = colName; 
    }
    return headerConfig;
  }

  constructor() {
    let refData = new Referential(uuidv4(), "REF_OFS_REE_DATA", "Entrées du REE des Entitées de l'Université de Genève", 
      (jsonRefOfsReeData as any).default, this.getHeaderConfig( Object.keys( (jsonRefOfsReeData as any).default[0] )));
    let refStat = new Referential(uuidv4(), "REF_OFS_REE_STATUT", "Définitions des status d'une entité REE de l'OFS", 
      (jsonRefOfsReeStatut as any).default, this.getHeaderConfig( Object.keys( (jsonRefOfsReeStatut as any).default[0] )));
    let refType = new Referential(uuidv4(), "REF_OFS_REE_TYPE", "Définitions des types d'entité REE de l'OFS", 
      (jsonRefOfsReeType as any).default, this.getHeaderConfig( Object.keys( (jsonRefOfsReeType as any).default[0] )));
    
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

  registerTemporary() {

  }
}
