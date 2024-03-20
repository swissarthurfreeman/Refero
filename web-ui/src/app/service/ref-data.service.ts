import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefDataService {

  constructor() { }

  private _currentRefId!: string;

  get CurrentRefId() {
    return this._currentRefId;
  }

  set CurrentRefId(refId: string) {
    this._currentRefId = refId;
  }

  private _currentRefHeader: Array<string> = ['REE_N_OFS', 'REE_NOM', 'C_ALPHA_NEW', 'ADRESSE'];
  
  get CurrentRefHeader() {
    return this._currentRefHeader;
  }

  private _refData: Array<Object> = [
    {'uid': 2375, 'REE_N_OFS': 102855, 'REE_NOM': "Unige CMU", 'C_ALPHA_NEW': 'UNACI', 'ADRESSE': 'Rue des Bains 26'},
    {'uid': 4096, 'REE_N_OFS': 102868, 'REE_NOM': "Faculté des Sciences", 'C_ALPHA_NEW': 'S', 'ADRESSE': 'Quai Ernest Ansermet 32'},
    {'uid': 2404, 'REE_N_OFS': 103225, 'REE_NOM': "Unige FSS", 'C_ALPHA_NEW': 'UNACI', 'ADRESSE': 'Rue de Montbrilland 64'}
  ];

  get RefData(): Array<Object> {
    return this._refData;
  }
}
