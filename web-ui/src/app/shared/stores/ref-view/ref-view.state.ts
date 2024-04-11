import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { StateEnum } from "../../enums/state.enum";
import { Referential } from "../../models/referential.model";
import { Injectable } from "@angular/core";
import { SetCurrentRef, SetInjectionMode } from "./ref-view.action";
import { RefService } from "../../services/ref.service";
import { Router } from "@angular/router";

export class RefViewStateModel {
    currRef: Referential = new Referential("", "", [], []);                  // referential we're rendering the view of 
    injectionMode: boolean = false;         // whether we're in injection mode or not
}

@State<RefViewStateModel>({
    name: StateEnum.ref_view
})
@Injectable()
export class RefViewState { // note that for the action to be active it has to be loaded via NgxsModule.forRoot/forFeature                     
    constructor(public ds: RefService, public store: Store, public router: Router) {}
    @Action(SetCurrentRef)
    setCurrentRef(ctx: StateContext<RefViewStateModel>, action: SetCurrentRef) {
        ctx.patchState({
            currRef: this.ds.getRefDataBy(action.RefId)
        })
    }

    @Action(SetInjectionMode)
    setInjectionViewMode(ctx: StateContext<RefViewStateModel>, action: SetInjectionMode) {
        ctx.patchState({
            injectionMode: action.active
        })
    }

    @Selector()
    static getCurrentRef(state: RefViewStateModel) {
        return state.currRef;
    }

    @Selector()
    static isInjectionMode(state: RefViewStateModel) {
        return state.injectionMode;
    }
}