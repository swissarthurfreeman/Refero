import { v4 as uuidv4 } from 'uuid';
import { View } from "./view.model";
import { Injection } from './injection.model';
import { Dict, Record } from './record.model';

export class Referential {
    uid: string;
    name: string;
    description: string;

    ref!: Referential;  // wtf is this ? 

    header: Dict<string> = new Map<string, string>();         // { colId: colName...} object
    originalHeader: Dict<string> = new Map<string, string>(); // {colId: originalName} object
    
    records: Dict<Record>;               // array of {colId: value...} objects
    get Records() {
        return Array.from(this.records.values());
    }
    
    views: Dict<View> = new Map<string, View>();            // { viewId: View...} object
    currView: View;                    // this is stateful and is a problem . 

    setCurrViewTo(viewId: string) {     
        this.currView = this.views.get(viewId)!;
    }

    get ViewIds() {
        return this.views.keys();
    }

    get headerIds(): Array<string> {
        return Array.from(this.header.keys());
    }

    /**
     * 
     * @param colId id of the column
     * @returns the name of the column
     */
    getColumnById(colId: string): string {
        return this.header.get(colId)!;     // TODO : remove these useless getters and deal with optionals    
    }

    getRecordById(recId: string): Record {
        return this.records.get(recId)!;
    }

    setRecordById(rec: Record) {
        this.records.set(rec['id'], rec);
    }

    constructor(name: string, description: string, records: any[] | Record[], header: string[], uid?: string) {
        this.name = name;
        this.description = description;
        
        if(uid) {   
            this.uid = uid;
        } else {
            this.uid = uuidv4();
        }

        this.header = Referential.getHeaderConfig(header);
        
        // convert records from {colName: value...} to { colId1: value ...}
        // every line has a uid.
        let nRecs: Dict<Record> = new Map<string, Record>();

        for(let rec of records) {
            let nRec: Record = {};
            for(let colId of this.header.keys()) {
                let colName: string = this.header.get(colId)!;
                nRec[colId] = rec[colName]; 
            }
            nRec['id'] = uuidv4();
            nRecs.set(nRec['id'], nRec);
        }
        this.records = nRecs;

        // upper case column names
        for(let colId of Object.keys(this.header)) {
            this.originalHeader.set(colId, this.header.get(colId)!);        // keep track of file original columns
            this.header.set(colId, this.header.get(colId)!.toUpperCase());
        }

        // create default view, store it in view dictionary.
        let defView = new View("DEFAULT_VIEW", this);
        this.views.set(defView.id, defView);
        this.currView = defView;
    }

    /**
     * From a line {colName: value...} yield the header configuration
     * as {colId: colName...}.  
     */
    static getHeaderConfig(line: Array<string>): Dict<string> {
        let headerConfig: Dict<string> = new Map<string, string>();
        for (let colName of line) {
            headerConfig.set(uuidv4(), colName); 
        }
        return headerConfig;
    }

    injections: Dict<Injection> = new Map<string, Injection>();

    getInjections(): Injection[] {
        return Array.from(this.injections.values());
    }

    addInjection(injection: Injection) {
        this.injections.set(injection.uid, injection);
    }
}