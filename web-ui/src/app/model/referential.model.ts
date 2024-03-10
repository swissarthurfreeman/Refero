export class Referential {
    name: string;
    code: string
    description: string;
    
    constructor(name: string, description: string, code: string) {
        this.name = name;
        this.description = description;
        this.code = code;
    }
}