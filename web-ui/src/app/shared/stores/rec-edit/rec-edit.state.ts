import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { StateEnum } from "../../enums/state.enum";
import { Referential } from "../../models/referential.model";
import { Record } from "../../models/record.model"
import { Injectable } from "@angular/core";
import { RefService } from "../../services/ref.service";
import { Router } from "@angular/router";
import { Injection } from "../../models/injection.model";
import { SetDestRec, SetDestRecId, SetDestRef, SetInjection, SetSrcRef } from "./rec-edit.action";

export class RefEditStateModel {
    DestRecId: string = '';
    DestRec: Record = {};
    SrcRef: Referential = new Referential("", "", [], []);
    DestRef: Referential = new Referential("", "", [], []);
    Injection: Injection = new Injection("", [], "", []);
}

@State<RefEditStateModel>({
    name: StateEnum.rec_edit
})
@Injectable()
export class RecEditState { // note that for the action to be active it has to be loaded via NgxsModule.forRoot/forFeature                     
    constructor(public ds: RefService, public store: Store, public router: Router) {}
    
    @Action(SetDestRecId)
    setDestRecId(ctx: StateContext<RefEditStateModel>, action: SetDestRecId) {
        ctx.patchState({
            DestRecId: action.record
        })
    }


    @Action(SetDestRec)
    setDestRec(ctx: StateContext<RefEditStateModel>, action: SetDestRec) {
        ctx.patchState({
            DestRec: action.record
        })
    }

    @Action(SetInjection) 
    setInjection(ctx: StateContext<RefEditStateModel>, action: SetInjection) {
        ctx.patchState({
            Injection: action.injection
        })
    }

    @Action(SetSrcRef)
    setSrcRef(ctx: StateContext<RefEditStateModel>, action: SetSrcRef) {
        ctx.patchState({
            SrcRef: action.ref
        })
    }

    @Action(SetDestRef)
    setDestRef(ctx: StateContext<RefEditStateModel>, action: SetDestRef) {
        ctx.patchState({
            DestRef: action.record
        })
    }

    @Selector()
    static getDestRecId(state: RefEditStateModel) {
        return state.DestRecId;
    }

    @Selector()
    static getInjection(state: RefEditStateModel) {
        return state.Injection;
    }

    @Selector()
    static getSrcRef(state: RefEditStateModel) {
        return state.SrcRef;
    }

    @Selector()
    static getDestRef(state: RefEditStateModel) {
        return state.DestRef;
    }

    @Selector()
    static getDestRec(state: RefEditStateModel) {
        return state.DestRec;
    }
}