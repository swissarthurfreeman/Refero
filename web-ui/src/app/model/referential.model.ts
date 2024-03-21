export class Referential {
    id: string;
    description: string;
    lines: Array<Object>;

    get header(): Array<string> {
        return Object.keys(this.lines[0]);
    }

    constructor(refId: string, description: string, lines: Array<Object>) {
        this.id = refId;
        this.description = description;
        this.lines = lines;
    }
}