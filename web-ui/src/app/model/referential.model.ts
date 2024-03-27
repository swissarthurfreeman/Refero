import { RefDataService } from "../service/ref-data.service";
import { View } from "./view.model";
import { v4 as uuidv4 } from 'uuid';

export interface Dictionary<T> {
    [Key: string]: T;
}

export class Referential {
    uid: string;
    name: string;
    description: string;
    ref!: Referential;

    header: Dictionary<string> = {};         // { colId: colName...} object
    originalHeader: Dictionary<string> = {}; // {colId: originalName} object
    lines: Array<Dictionary<string>>;        // array of {colId: value...} objects
    
    views: Dictionary<View> = {};            // { viewId: View...} object
    currView: View;                          // currently selected view

    setCurrViewTo(viewId: string) {
        this.currView = this.views[viewId];
    }

    get ViewIds() {
        return Object.keys(this.views);
    }

    get headerIds(): Array<string> {
        return Object.keys(this.header);
    }

    /**
     * 
     * @param colId id of the column
     * @returns the name of the column
     */
    getColumnById(colId: string): string {
        return this.header[colId];    
    }

    getRecordById(recId: string): Dictionary<string> {
        return this.lines.filter((line) => line['uid'] != recId)[0];    // we know lines are unique by uid.
    }

    constructor(name: string, description: string, 
        lines: Array<Dictionary<string>>, header: Array<string>) {
        
        this.name = name;
        this.description = description;
        this.uid = uuidv4();
        this.header = Referential.getHeaderConfig(header);
        console.log("here", Object.values(this.header));
        
        // convert lines from {colName: value...} to { colId1: value ...}
        // every line has a uid.
        let nLines: Array<Dictionary<string>> = [];
        for(let line of lines) {
            let nLine: Dictionary<string> = {}
            for(let colId of Object.keys(this.header)) {
                nLine[colId] = line[this.header[colId]]; 
            } 
            nLine['uid'] = uuidv4();
            nLines.push(nLine);
        }
        this.lines = nLines;

        // upper case column names
        for(let colId of Object.keys(this.header)) {
            this.originalHeader[colId] = this.header[colId];        // keep track of file original columns
            this.header[colId] = this.header[colId].toUpperCase();
        }

        // create default view, store it in view dictionary.
        let defView = new View("DEFAULT_VIEW", this);
        this.views[defView.uid] = defView;
        this.currView = defView;
    }

    /**
     * From a line {colName: value...} yield the header configuration
     * as {colId: colName...}.  
     */
    static getHeaderConfig(line: Array<string>): Dictionary<string> {
        let headerConfig: Dictionary<string> = {}
        for (let colName of line) {
            headerConfig[uuidv4()] = colName; 
        }
        return headerConfig;
    }
}