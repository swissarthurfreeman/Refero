interface Dictionary<T> {
    [Key: string]: T;
}
  
export class Referential {
    name: string;
    description: string;
    // array of {colId: value...} objects
    lines: Array<Dictionary<string>>;
    public uid: string;
    /*headerId: name key pair collection*/
    _header: Dictionary<string> = {};

    set header(header: Dictionary<string>) {
        this._header = header;
    }

    get header(): Dictionary<string> {
        return this._header;
    }

    get headerIds(): Array<string> {
        return Object.keys(this._header);
    }

    getColumnById(colId: string): string {
        return this._header[colId];    
    }

    constructor(uid: string, name: string, description: string, lines: Array<Dictionary<string>>, header: Dictionary<string>) {
        this.name = name;
        this.description = description;
        this.uid = uid;
        this._header = header;
        
        // lines with { colId1: value ...} objects
        let nLines: Array<Dictionary<string>> = [];
        for(let line of lines) {
            let nLine: Dictionary<string> = {}
            for(let colId of Object.keys(this._header)) {
                nLine[colId] = line[this._header[colId]]; 
            } 
            nLines.push(nLine);
        }
        this.lines = nLines;
    }
}