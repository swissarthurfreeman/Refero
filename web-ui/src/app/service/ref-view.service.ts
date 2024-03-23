import { Injectable, inject } from '@angular/core';
import { UtilsService } from './utils.service';
import { RefDataService } from './ref-data.service';

interface Dictionary<T> {
  [Key: string]: T;
}

/**
 * Manages the Views of Referentials : active search fields, filters and columns.
 * Exposes visible Columns and Search Fields, as well as interfaces to add or 
 * remove them for specific referentials. 
 */
@Injectable({
  providedIn: 'root'
})
export class RefViewService {

  utils = inject(UtilsService);
  ds = inject(RefDataService);

  // keyable by RefUid, viewId and dispCols, nDispCols, searchCols, nSearchCols
  private _viewDict: Dictionary<Dictionary<Dictionary<Array<string>>>> = {};
  private _savedViewDict: Dictionary<Dictionary<any>>;                       // TODO : define view in front-end model
  public dispAddOpt!: string;      // only defined in consultation view
  public searchAddOpt!: string;    // views may only be changed or saved in consultation view.
  
  constructor() {
    console.log("Constructor Invoked");
    this._viewDict = {}
    this._savedViewDict = {}
      
    for (let ref of this.ds.getRefs()) {
      this._viewDict[ref.uid] = {}

      /*Allows restoring default view*/
      this._viewDict[ref.uid]['DEFAULT_VIEW'] = {
        'headerIds': ref.headerIds,
        'dispCols': [ref.headerIds[0], ref.headerIds[1], ref.headerIds[2]],      // by default, show first three columns
        'searchCols': [ref.headerIds[0], ref.headerIds[1], ref.headerIds[2]],    // and search fields on them
      }
      
      // inactive search fields
      this._viewDict[ref.uid]['DEFAULT_VIEW']['nSearchCols'] = this.utils.difference(
        ref.headerIds, this._viewDict[ref.uid]['DEFAULT_VIEW']['searchCols']);
      
      // inactive table columns, e.g. not displayed on screen
      this._viewDict[ref.uid]['DEFAULT_VIEW']['nDispCols'] = this.utils.difference(
        ref.headerIds, this._viewDict[ref.uid]['DEFAULT_VIEW']['dispCols']);

      // save before any user modifications, this is the server source of truth
      this._savedViewDict[ref.uid] = {}
      
      this._savedViewDict[ref.uid]['DEFAULT_VIEW'] = JSON.parse(JSON.stringify(this._viewDict[ref.uid]['DEFAULT_VIEW']));
    }
  }

  getViewsOf(RefUid: string): string[] {
    return Object.keys(this._viewDict[RefUid]);
  }

  saveVisibleViewAs(RefUid: string, selectedViewId: string, newViewId: string) {
    /*Actually saves the view the user sees (which is potentially a modified version)
    of the selected view to the system, this function will actually commit this
    to the database, users can modify any view they like locally and it'll be 
    saved in the state of the browser service, but not in the backend, this will
    only be persisted upon saving the view. */
    if(newViewId == selectedViewId) { // if we're updating the current view, not creating a new one
      this._savedViewDict[RefUid][selectedViewId] = JSON.parse(JSON.stringify(this._viewDict[RefUid][selectedViewId]));
    } else {
      // create new view
      this._viewDict[RefUid][newViewId] = this._viewDict[RefUid][selectedViewId];
      // restore saved view of selectedViewId
      this._viewDict[RefUid][selectedViewId] = this._savedViewDict[RefUid][selectedViewId];
      // save new view
      this._savedViewDict[RefUid][newViewId] = JSON.parse(JSON.stringify(this._viewDict[RefUid][newViewId]));
      // Do POST / PUT request... and trigger reload (simpler...)
    }
  }

  // remove a column from the table view, must be removed from displayed
  // columns and added to non displayed columns. 
  removeDispCol(RefUid: string, viewId: string, col: string) {
    let view = this._viewDict[RefUid][viewId];
    view['dispCols'] = view['dispCols'].filter(item => item != col);
    view['nDispCols'].push(col);
  }

  addDispCol(RefUid: string, viewId: string, col: string) {
    let view = this._viewDict[RefUid][viewId];
    view['dispCols'].push(col);
    view['nDispCols'] = this.utils.difference(view['headerIds'], view['dispCols']);

    if (view['nDispCols'].length > 0) {      // if there's still columns we can add
      this.dispAddOpt = view['nDispCols'][0];
    }
  }

  addSearchCol(RefUid: string, viewId: string, col: string) {
    let view = this._viewDict[RefUid][viewId];
    view['searchCols'].push(col);
    view['nSearchCols'] = this.utils.difference(view['headerIds'], view['searchCols']);

    if(view['nSearchCols'].length > 0) {
      this.searchAddOpt = view['nSearchCols'][0];
    }
  }

  removeSearchCol(RefUid: string, viewId: string, col: string) {
    let view = this._viewDict[RefUid][viewId];
    view['searchCols'] = view['searchCols'].filter(item => item != col);
    view['nSearchCols'].push(col);
  }
  
  getSearchCols(RefUid: string, viewId: string) {
    return this._viewDict[RefUid][viewId]['searchCols'];
  }

  getNSearchCols(RefUid: string, viewId: string) {
    return this._viewDict[RefUid][viewId]['nSearchCols'];
  }

  getDispCol(RefUid: string, viewId: string) {
    return this._viewDict[RefUid][viewId]['dispCols'];
  }

  getNDispCol(RefUid: string, viewId: string) {
    return this._viewDict[RefUid][viewId]['nDispCols'];
  }
}
