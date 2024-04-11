import { Injection } from "../../models/injection.model";
import { Dictionary, Referential } from "../../models/referential.model";

export class SetDestRecId {
    static readonly type: string = "[RecEdit] Set Destination Record Id to Inject to";
    constructor(public record: string) {}
}

export class SetDestRec {
    static readonly type: string = "[RecEdit] Set Destination Record to Inject to";
    constructor(public record: Dictionary<string>) {}
}

export class SetDestRef {
    static readonly type: string = "[RecEdit] Set Destination Referential"; // to be able to modify it's lines
    constructor(public record: Referential) {}
}

export class SetSrcRef {
    static readonly type: string = "[RecEdit] Set Source Referential of Injection";
    constructor(public ref: Referential) {}
}

export class SetInjection {
    static readonly type: string = "[RecEdit] Set Injection to Apply";
    constructor(public injection: Injection) {}
}
