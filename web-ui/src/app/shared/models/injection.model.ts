import { v4 as uuidv4 } from 'uuid';
import { Dictionary, Referential } from './referential.model';
import { RefService } from '../services/ref.service';
import { inject } from '@angular/core';

export class Injection {
    srcId: string;          // referential from the which we're taking a line
    destId: string;         // referential to the which we're inserting
    srcColIds: string[];    // injection is essentially two arrays of same size
    destColIds: string[];   // of source col ids and destination col ids. 
    uid: string;

    constructor(srcId: string, srcColIds: string[], destId: string, destColIds: string[]) {
        this.uid = uuidv4();
        this.srcId = srcId;
        this.destId = destId;
        this.srcColIds = srcColIds;
        this.destColIds = destColIds;
    }

    apply(srcRow: Dictionary<string>, destRow: Dictionary<string>): Dictionary<string> {
        let injectResult = structuredClone(destRow);
        
        for(let i=0; i < this.srcColIds.length; i++) {
            injectResult[this.destColIds[i]] = srcRow[this.srcColIds[i]]; 
        }
        return injectResult;
    }
}