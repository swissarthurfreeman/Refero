import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { StateEnum } from "../../enums/state.enum";
import { Referential } from "../../models/referential.model";
import { Injectable } from "@angular/core";
import { RefService } from "../../services/ref.service";
import { Router } from "@angular/router";
import { SetInjectionSourceRef, SetInjectionSourceRefView } from "./rec-edit.action";
import { View } from "../../models/view.model";

export class RecEditStateModel {
    SourceRef!: Referential;
    SourceRefView!: View;
}

@State<RecEditStateModel>({
    name: StateEnum.rec_edit
})
@Injectable()
export class RecEditState {                       
    constructor(public rs: RefService, public store: Store, public router: Router) {}
    
    @Action(SetInjectionSourceRef)
    setInjectionSourceReferential(ctx: StateContext<RecEditStateModel>, action: SetInjectionSourceRef) {
        ctx.patchState({
            SourceRef: action.Ref
        })
    }

    @Action(SetInjectionSourceRefView)
    selectRefConfigToEdit(ctx: StateContext<RecEditStateModel>, action: SetInjectionSourceRefView) {
        ctx.patchState({
            SourceRefView: action.View
        })
    }

    @Selector()
    static getInjectionSourceRef(state: RecEditStateModel) {
        return state.SourceRef;
    }

    @Selector()
    static getInjectionSourceRefView(state: RecEditStateModel) {
        return state.SourceRefView;
    }
}