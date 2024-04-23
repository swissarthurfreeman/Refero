import { v4 as uuidv4 } from 'uuid';
import { Record } from './record.model';

export class Injection {
    id!: string;
    srcId!: string;          // referential from the which we're taking a line
    srcName!: string;
    ref_id!: string;         // referential to the which we're inserting
    srcColIds!: string[];    // injection is essentially two arrays of same size
    destColIds!: string[];   // of source col ids and destination col ids. 
    
    /**
     * This function does not modify it's parameters, it returns a clone
     * of destRecord with injected column values. 
     * @param srcRec the record to inject from 
     * @param destRec the record to inject to
     * @returns the new cloned injected record
     */
    /*
    apply(srcRec: Record, destRec: Record): Record {
        let injectResult = structuredClone(destRec);
        
        for(let i=0; i < this.srcColIds.length; i++) {
            injectResult[this.destColIds[i]] = srcRec[this.srcColIds[i]]; 
        }
        return injectResult;
    }*/
}

