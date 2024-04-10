import { State } from "@ngxs/store";
import { LanguagesEnum } from "../enums/languages.enum";
import { Injectable } from "@angular/core";

export interface AppStateModel {
    appLanguage: LanguagesEnum;
}

@State<AppStateModel>({
    name: 'application',
    defaults: {
        appLanguage: LanguagesEnum.en
    }
})
@Injectable()
export class AppState {

}