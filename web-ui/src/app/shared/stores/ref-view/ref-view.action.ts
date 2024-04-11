export class SetCurrentRef {
    static readonly type: string = "[Home] Set Current Referential";  
    constructor(public RefId: string) {}
}

export class SetInjectionMode {
    static readonly type: string = "[RefView] Set Injection Mode";
    constructor(public active: boolean) {}
}

