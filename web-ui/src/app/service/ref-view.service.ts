import { Injectable, inject } from '@angular/core';
import { UtilsService } from './utils.service';

/**
 * Manages the current Referential View's active columns,
 * active search fields and filters.
 * Exposes visible Columns and Search Fields, as well as 
 * interfaces to add or remove them. 
 */
@Injectable({
  providedIn: 'root'
})
export class RefViewService {

  utils = inject(UtilsService);

  constructor() {
    this._dispCols = ['REE_N_OFS', 'REE_NOM'];
    this._nDispCols = this.utils.difference(this._cols, this._dispCols);
    this._dispAddOpt = this._nDispCols[0];
    
    this._searchCols = ['REE_N_OFS'];
    this._nSearchCols = this.utils.difference(this._cols, this._searchCols);
    this._searchAddOpt = this._nSearchCols[0];
  }

  // 'Add Column' select field value binding
  _dispAddOpt: string;
  get DispAddOpt() {
    return this._dispAddOpt;
  }  

  // referential table header 
  _cols: Array<string> = ['REE_N_OFS', 'REE_NOM', 'C_ALPHA_NEW', 'ADRESSE'];
  get Cols(): Array<string> {
    return this._cols;
  }

  // active table columns, displayed on screen
  _dispCols: Array<string> = ['REE_N_OFS', 'REE_NOM'];  
  get DispCols(): Array<String> {
    return this._dispCols;
  }

  // inactive table columns, e.g. not displayed on screen
  // get/set are not primarily used to get and set variables. 
  // They are, however, used to execute code upon the getting 
  // or setting of a variable.
  _nDispCols: Array<string>;       
  get nDispCols(): Array<string> {
    return this._nDispCols;
  }
  
  // remove a column from the table view, must be removed from displayed
  // columns and added to non displayed columns. 
  removeDispCol(column: string) {
    this._dispCols = this._dispCols.filter(item => item != column);
    this._nDispCols.push(column);
  }

  addDispCol(column: string) {
    this._dispCols.push(column);
    this._nDispCols = this.utils.difference(this._cols, this._dispCols);
    if (this._nDispCols[0].length > 0) {      // if there's still columns we can add
      this._dispAddOpt = this._nDispCols[0];
    }
  }

  _searchAddOpt: string;           // 'Add Search' select field value binding
  get SearchAddOpt() {
    return this._searchAddOpt;
  }

  _searchCols: Array<string>;      // active search fields
  get SearchCols() {
    return this._searchCols;
  }

  _nSearchCols: Array<string>;     // unactive search fields
  get nSearchCols() {
    return this._nSearchCols;
  }

  addSearchCol(column: string) {
    this._searchCols.push(column)
    this._nSearchCols = this.utils.difference(this._cols, this._searchCols);
    if(this._nSearchCols.length > 0) {
      this._searchAddOpt = this._nSearchCols[0];
    }
  }

  removeSearchCol(column: string) {
    this._searchCols = this._searchCols.filter(item => item != column);
    this._nSearchCols.push(column);
  }
}
