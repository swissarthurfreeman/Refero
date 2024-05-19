import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { StateEnum } from "../../enums/state.enum";
import { Referential } from "../../models/referential.model";
import { Injectable } from "@angular/core";
import { SetCurrentRef, SetCurrentView, SetInjection, SetInjectionMode, SetSearchFilterValue } from "./ref-view.action";
import { RefService } from "../../services/ref.service";
import { Router } from "@angular/router";
import { View } from "../../models/view.model";
import { ViewService } from "../../services/view.service";
import { Injection } from "../../models/injection.model";

export class RefViewStateModel {
    currRef!: Referential;                   // referential we're rendering the view of 
    currView!: View;
    injectionMode!: boolean;                 // whether we're in injection mode or not
    injection!: Injection;
    searchFilterValue!: string;                    // the search filter value
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
            currRef: action.Ref
        })
    }

    @Action(SetInjectionMode)
    setInjectionViewMode(ctx: StateContext<RefViewStateModel>, action: SetInjectionMode) {
        ctx.patchState({
            injectionMode: action.active
        })
    }
    
    @Action(SetInjection)
    setInjection(ctx: StateContext<RefViewStateModel>, action: SetInjection) {
        ctx.patchState({
            injection: action.injection
        })
    }

    @Action(SetCurrentView)
    setCurrentView(ctx: StateContext<RefViewStateModel>, action: SetCurrentView) {
        ctx.patchState({
            currView: action.View
        })
    }

    @Action(SetSearchFilterValue)
    setSearchFilterValue(ctx: StateContext<RefViewStateModel>, action: SetSearchFilterValue) {
        ctx.patchState({
            searchFilterValue: action.searchFilterValue
        })
    }

    @Selector()
    static getSearchFilterValue(state: RefViewStateModel) {
        return state.searchFilterValue;
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

    @Selector()
    static getInjection(state: RefViewStateModel) {
        return state.injection;
    }
}