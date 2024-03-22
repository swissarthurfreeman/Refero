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

  // keyable by refId, viewId and dispCols, nDispCols, searchCols, nSearchCols
  private _viewDict: Dictionary<Dictionary<Dictionary<Array<string>>>> = {};
  private _savedViewDict: Dictionary<Dictionary<any>>;                       // TODO : define view in front-end model
  public dispAddOpt!: string;      // only defined in consultation view
  public searchAddOpt!: string;    // views may only be changed or saved in consultation view.
  
  constructor() {
    console.log("Constructor Invoked");
    this._viewDict = {}
    this._savedViewDict = {}
      
    for (let ref of this.ds.getRefs()) {
      this._viewDict[ref.id] = {}

      /*Allows restoring default view*/
      this._viewDict[ref.id]['DEFAULT_VIEW'] = {
        'header': ref.header,
        'dispCols': [ref.header[0], ref.header[1], ref.header[2]],      // by default, show first three columns
        'searchCols': [ref.header[0], ref.header[1], ref.header[2]],    // and search fields on them
      }
      
      // inactive search fields
      this._viewDict[ref.id]['DEFAULT_VIEW']['nSearchCols'] = this.utils.difference(
        ref.header, this._viewDict[ref.id]['DEFAULT_VIEW']['searchCols']);
      
      // inactive table columns, e.g. not displayed on screen
      this._viewDict[ref.id]['DEFAULT_VIEW']['nDispCols'] = this.utils.difference(
        ref.header, this._viewDict[ref.id]['DEFAULT_VIEW']['dispCols']);

      // save before any user modifications, this is the server source of truth
      this._savedViewDict[ref.id] = {}
      
      console.log("HERREEEE");
      this._savedViewDict[ref.id]['DEFAULT_VIEW'] = JSON.parse(JSON.stringify(this._viewDict[ref.id]['DEFAULT_VIEW']));
      console.log("HERREEEE222");
    }
  }

  getViewsOf(refId: string): string[] {
    return Object.keys(this._viewDict[refId]);
  }

  saveVisibleViewAs(refId: string, selectedViewId: string, newViewId: string) {
    /*Actually saves the view the user sees (which is potentially a modified version)
    of the selected view to the system, this function will actually commit this
    to the database, users can modify any view they like locally and it'll be 
    saved in the state of the browser service, but not in the backend, this will
    only be persisted upon saving the view. */
    if(newViewId == selectedViewId) { // if we're updating the current view, not creating a new one
      this._savedViewDict[refId][selectedViewId] = JSON.parse(JSON.stringify(this._viewDict[refId][selectedViewId]));
    } else {
      // create new view
      this._viewDict[refId][newViewId] = this._viewDict[refId][selectedViewId];
      // restore saved view of selectedViewId
      this._viewDict[refId][selectedViewId] = this._savedViewDict[refId][selectedViewId];
      // save new view
      this._savedViewDict[refId][newViewId] = JSON.parse(JSON.stringify(this._viewDict[refId][newViewId]));
      // Do POST / PUT request... and trigger reload (simpler...)
    }
  }

  // remove a column from the table view, must be removed from displayed
  // columns and added to non displayed columns. 
  removeDispCol(refId: string, viewId: string, col: string) {
    let view = this._viewDict[refId][viewId];
    view['dispCols'] = view['dispCols'].filter(item => item != col);
    view['nDispCols'].push(col);
  }

  addDispCol(refId: string, viewId: string, col: string) {
    let view = this._viewDict[refId][viewId];
    view['dispCols'].push(col);
    view['nDispCols'] = this.utils.difference(view['header'], view['dispCols']);

    if (view['nDispCols'].length > 0) {      // if there's still columns we can add
      this.dispAddOpt = view['nDispCols'][0];
    }
  }

  addSearchCol(refId: string, viewId: string, col: string) {
    let view = this._viewDict[refId][viewId];
    view['searchCols'].push(col);
    view['nSearchCols'] = this.utils.difference(view['header'], view['searchCols']);

    if(view['nSearchCols'].length > 0) {
      this.searchAddOpt = view['nSearchCols'][0];
    }
  }

  removeSearchCol(refId: string, viewId: string, col: string) {
    let view = this._viewDict[refId][viewId];
    view['searchCols'] = view['searchCols'].filter(item => item != col);
    view['nSearchCols'].push(col);
  }
  
  getSearchCols(refId: string, viewId: string) {
    return this._viewDict[refId][viewId]['searchCols'];
  }

  getNSearchCols(refId: string, viewId: string) {
    return this._viewDict[refId][viewId]['nSearchCols'];
  }

  getDispCol(refId: string, viewId: string) {
    return this._viewDict[refId][viewId]['dispCols'];
  }

  getNDispCol(refId: string, viewId: string) {
    return this._viewDict[refId][viewId]['nDispCols'];
  }
}
