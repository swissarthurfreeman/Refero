import { Referential } from "../../models/referential.model";
import { View } from "../../models/view.model";

export class SetInjectionSourceRef {
    static readonly type: string = "[RecConfig] Select Injection Source Ref";  
    constructor(public Ref: Referential) {}
}

export class SetInjectionSourceRefView {
    static readonly type: string = "[RecConfig] Select Injection Source Ref View";  
    constructor(public View: View) {}
}