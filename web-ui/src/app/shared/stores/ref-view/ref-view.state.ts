import { State, Action, StateContext, Store, Select, Selector } from "@ngxs/store";
import { StateEnum } from "../../enums/state.enum";
import { Dictionary, Referential } from "../../models/referential.model";
import { Injectable } from "@angular/core";
import { ConsultRef, SelectDestRec, SelectInjectionSourceRef, SetInjectionSrcRef, SetInjectionViewMode } from "./ref-view.action";
import { RefService } from "../../services/ref.service";
import { Router } from "@angular/router";

export class RefViewStateModel {
    ref!: Referential;                                                   // referential we're rendering the view of 
    injectionMode: boolean = false;                                      // whether we're rendering it's simple view or not
    DestRec: Dictionary<string> = {};                                    // the record we're values into, default value required.
    SourceRef: Referential = new Referential("", "", [], []);            // the referential we're taking values to inject to ref from
}

@State<RefViewStateModel>({
    name: StateEnum.ref_view
})
@Injectable()
export class RefViewState { // note that for the action to be active it has to be loaded via NgxsModule.forRoot/forFeature                     
    constructor(public ds: RefService, public store: Store, public router: Router) {}
    @Action(ConsultRef)
    consultRef(ctx: StateContext<RefViewStateModel>, action: ConsultRef) {
        ctx.patchState({
            ref: this.ds.getRefDataBy(action.RefId)
        })
        //console.log(this.store.snapshot());
    }

    @Action(SelectDestRec)
    selectDestRec(ctx: StateContext<RefViewStateModel>, action: SelectDestRec) {
        ctx.patchState({
            DestRec: this.ds.getRefDataBy(action.RefId).getRecordById(action.RecId),
        })
    }

    @Action(SetInjectionViewMode)
    setInjectionViewMode(ctx: StateContext<RefViewStateModel>, action: SetInjectionViewMode) {
        ctx.patchState({
            injectionMode: action.active
        })
    }

    @Action(SelectInjectionSourceRef)
    selectInjectionSourceRef(ctx: StateContext<RefViewStateModel>, action: SelectInjectionSourceRef) {
        ctx.patchState({
            SourceRef: this.ds.getRefDataBy(action.RefId)
        })
    }

    @Action(SetInjectionSrcRef)
    setInjectionSrcRef(ctx: StateContext<RefViewStateModel>, action: SetInjectionSrcRef) {
        ctx.patchState({
            SourceRef: action.Ref
        })
    }

    @Selector()
    static getSourceRef(state: RefViewStateModel) {
        return state.SourceRef;
    }

    @Selector()
    static getRef(state: RefViewStateModel) {
        return state.ref;
    }

    @Selector()
    static isInjectionMode(state: RefViewStateModel) {
        return state.injectionMode;
    }

    @Selector()
    static getDestRec(state: RefViewStateModel): Dictionary<string> {
        return state.DestRec;
    }
}