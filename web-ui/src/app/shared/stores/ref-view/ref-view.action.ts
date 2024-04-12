export class SetCurrentRef {
    static readonly type: string = "[Home] Set Current Referential";  
    constructor(public RefId: string) {}
}

export class SetCurrentView {
    static readonly type: string = "[View] Set Current Referential View";  
    constructor(public RefId: string, public ViewId?: string) {}    // ViewId is not provided, the default view is set. 
}

export class SetInjectionMode {
    static readonly type: string = "[RefView] Set Injection Mode";
    constructor(public active: boolean) {}
}

