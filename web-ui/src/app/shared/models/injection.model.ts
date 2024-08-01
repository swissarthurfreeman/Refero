import {Record} from './record.model';

export class Injection {
  id!: string;
  srcid!: string;          // referential from the which we're taking a line
  srcname!: string;
  refid!: string;         // referential to the which we're inserting
  mappings: Record = {};
}

