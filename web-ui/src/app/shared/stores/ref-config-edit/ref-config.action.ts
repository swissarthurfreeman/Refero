import { Referential } from "../../models/referential.model";

export class SelectRefConfigToEdit {
    static readonly type: string = "[RefConfig] Select Ref Config To Edit";  
    constructor(public Ref: Referential) {}
}