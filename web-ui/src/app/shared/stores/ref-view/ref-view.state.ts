import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { StateEnum } from "../../enums/state.enum";
import { Referential } from "../../models/referential.model";
import { Injectable } from "@angular/core";
import { SetCurrentRef, SetCurrentView, SetInjectionMode } from "./ref-view.action";
import { RefService } from "../../services/ref.service";
import { Router } from "@angular/router";
import { View } from "../../models/view.model";
import { ViewService } from "../../services/view.service";

export class RefViewStateModel {
    currRef!: Referential;                   // referential we're rendering the view of 
    currView!: View;
    injectionMode!: boolean;                 // whether we're in injection mode or not
}

@State<RefViewStateModel>({
    name: StateEnum.ref_view
})
@Injectable()
export class RefViewState { // note that for the action to be active it has to be loaded via NgxsModule.forRoot/forFeature                     
    constructor(public ds: RefService, public vs: ViewService, public store: Store, public router: Router) {}
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

    @Action(SetCurrentView)
    setCurrentView(ctx: StateContext<RefViewStateModel>, action: SetCurrentView) {
        if(action.ViewId === undefined) {
            ctx.patchState({
                currView: this.vs.getDefaultViewOfRef(action.RefId)!
            })
        } else {
            console.log("Found View :", action.ViewId);
            console.log("Got View :", this.vs.getViewById(action.ViewId)!);
            ctx.patchState({
                currView: this.vs.getViewById(action.ViewId)!
            })
        }
        
    }

    @Selector()
    static getCurrentView(state: RefViewStateModel) {
        return state.currView;
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