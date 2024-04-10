import { v4 as uuidv4 } from 'uuid';
import { Referential } from './referential.model';

export class View {
    uid: string;
    name: string;
    ref: Referential;
    
    dispCols: Array<string>;
    _dispCols: Array<string>;
    nDispCols!: Array<string>;
    dispAddOpt!: string;
    
    searchCols: Array<string>;
    _searchCols: Array<string>;
    nSearchCols!: Array<string>;
    searchAddOpt!: string;

    /**
     * If dispCols and searchCols are provided, then it won't be the default view.
     */
    constructor(name: string, ref: Referential, 
        dispCols?: Array<string>, searchCols?: Array<string>) {
        this.name = name;
        this.uid = uuidv4();
        this.ref = ref;
        
        this.dispCols = [ref.headerIds[0], ref.headerIds[1], ref.headerIds[2], ref.headerIds[3]];
        if(dispCols) this.dispCols = dispCols;
        this._dispCols = this.dispCols.slice(0)!;       // save initial state

        this.searchCols = this.dispCols.slice(0);   // coppy array
        if(searchCols) this.searchCols = searchCols;
        this._searchCols = this.searchCols.slice(0)!;    // save initial state
        
        this._initChoices() // populate select fields options
    }

    _initChoices() {
        this.nSearchCols = this.difference(this.ref.headerIds, this.searchCols); 
        this.searchAddOpt = this.nSearchCols[0];

        this.nDispCols = this.difference(this.ref.headerIds, this.dispCols);
        this.dispAddOpt = this.nDispCols[0];
    }

    addDispCol(newCol: string) {
        this.dispCols.push(newCol);
        this.nDispCols = this.difference(this.ref.headerIds, this.dispCols);

        if (this.nDispCols.length > 0) {      // if there's still columns we can add
            this.dispAddOpt = this.nDispCols[0];
        } else {
            this.dispAddOpt = '';
        }
    }

    removeDispCol(col: string) {
        this.dispCols = this.dispCols.filter(item => item != col);
        this.nDispCols.push(col);
    }

    addSearchCol(newCol: string) {
        this.searchCols.push(newCol);
        this.nSearchCols = this.difference(this.ref.headerIds, this.searchCols);

        if(this.nSearchCols.length > 0) {
            this.searchAddOpt = this.nSearchCols[0];
        }
    }
    
    removeSearchCol(newCol: string) {
        this.searchCols = this.searchCols.filter(item => item != newCol);
        this.nSearchCols.push(newCol);
    }

    /**
     * Persist the current view to the database, either as a new view object
     * or an udpate of the current view.  
     */
    save(newName: string) {
        if (this.name == newName) { // if we're updating the current view
            this._dispCols = this.dispCols.slice(0);
            this._searchCols = this._searchCols.slice(0);  // upon restoration, restore to updated version
        } else {    // create new view, restore current view
            let view = new View(newName, this.ref, 
                this.dispCols.slice(0), this.searchCols.slice(0));
            
            this.ref.views[view.uid] = view;    // associate view to ref

            this.dispCols = this._dispCols.slice(0);
            this.searchCols = this._searchCols.slice(0);

            this._initChoices()
            // TODO : POST TO DATABASE
        }
    }

    /**
     * Add all header columns to display columns.
     * This function does not save the modifications,
     * `save()` needs to be called seperately. 
     */
    setDispColsToAllCols() {
        for(let nDispCol of this.nDispCols) {
            this.addDispCol(nDispCol);
        }
    }

    difference(arr1: Array<string>, arr2: Array<string>): Array<string> {
        return arr1.filter(item => arr2.indexOf(item) < 0);
    }
}