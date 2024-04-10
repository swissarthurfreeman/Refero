import { Referential } from "../../models/referential.model";

export class ConsultRef {
    static readonly type: string = "[RefView] Consult Ref";  
    constructor(public RefId: string) {}
}

export class SelectDestRec {
    static readonly type: string = "[RecEdit] Select Rec";  
    constructor(public RefId: string, public RecId: string) {}
}

export class SetInjectionViewMode {
    static readonly type: string = "[RecEdit] Toggle Simple View Mode";
    constructor(public active: boolean) {}
}

export class SelectInjectionSourceRef {
    static readonly type: string = "[RecEdit] Select Injection Source Ref";  
    constructor(public RefId: string) {}
}

export class SetInjectionSrcRef {
    static readonly type: string = "[RecEdit] Set Injection Source Ref";  
    constructor(public Ref: Referential) {}
}