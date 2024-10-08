import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { StateEnum } from "../../enums/state.enum";
import { Referential } from "../../models/referential.model";
import { Injectable } from "@angular/core";
import { RefService } from "../../services/ref.service";
import { Router } from "@angular/router";
import { SelectRefConfigToEdit } from "./ref-config.action";

export class RefConfigStateModel {
    ref!: Referential;
}

@State<RefConfigStateModel>({
    name: StateEnum.ref_config
})
@Injectable()
export class RefConfigState {                       
    constructor(public rs: RefService, public store: Store, public router: Router) {}
    @Action(SelectRefConfigToEdit)
    selectRefConfigToEdit(ctx: StateContext<RefConfigStateModel>, action: SelectRefConfigToEdit) {
        ctx.patchState({
            ref: action.Ref
        })
    }

    @Selector()
    static getRef(state: RefConfigStateModel) {
        return state.ref;
    }
}