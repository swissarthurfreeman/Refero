import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppState } from './shared/stores/app.state';
import { RefViewState } from './shared/stores/ref-view/ref-view.state';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RefConfigState } from './shared/stores/ref-config-edit/ref-config.state';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import { RecEditState } from './shared/stores/rec-edit/rec-edit.state';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [
        provideClientHydration(),
        provideHttpClient(withFetch()),
        provideRouter([
        //    {component: ViewRoutableComponent, path: 'view'}    // makes @Input() work on ViewRoutableComponent...
        ],
        withComponentInputBinding()),
        provideAnimationsAsync(),
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }

    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxsModule.forRoot([
            AppState,
            RefViewState,
            RecEditState,
            RefConfigState
        ]),
        NgxsLoggerPluginModule,
        NgxsReduxDevtoolsPluginModule.forRoot()
    ]
})
export class AppModule { }
