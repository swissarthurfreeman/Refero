import { Referential } from "../../models/referential.model";
import { View } from "../../models/view.model";
import {Injection} from "../../models/injection.model";

export class SetInjectionSourceRef {
    static readonly type: string = "[RecEdit] Select Injection Source Ref";
    constructor(public Ref: Referential) {}
}

export class SetInjectionSourceRefView {
    static readonly type: string = "[RecEdit] Select Injection Source Ref View";
    constructor(public View: View) {}
}

// This is selected in table to know where to inject to.
export class SetInjection {
  static readonly type: string = "[RecEdit] Set Injection";
  constructor(public injection: Injection) {}
}

export class SetInjectionMode {
  static readonly type: string = "[RecEdit] Set Injection Mode";
  constructor(public active: boolean) {}
}


