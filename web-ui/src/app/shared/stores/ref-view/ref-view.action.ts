import { Injection } from "../../models/injection.model";
import { Referential } from "../../models/referential.model";
import { View } from "../../models/view.model";

export class SetCurrentRef {
    static readonly type: string = "[Home] Set Current Referential";  
    constructor(public Ref: Referential) {}
}

export class SetCurrentView {
    static readonly type: string = "[View] Set Current Referential View";  
    constructor(public View: View) {}    // ViewId is not provided, the default view is set. 
}

export class SetSearchFilterValue {
    static readonly type: string = "[View] Set Search Filters Value ";  
    constructor(public searchFilterValue: string) {}
}

export class SetInjectionMode {
    static readonly type: string = "[RefView] Set Injection Mode";
    constructor(public active: boolean) {}
}

export class SetInjection {
    static readonly type: string = "[RefView] Set Injection";
    constructor(public injection: Injection) {}
}

