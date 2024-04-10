import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppState } from './shared/stores/app.state';
import { NavbarComponent } from "./features/navbar/navbar.component";
import { RefViewState } from './shared/stores/ref-view/ref-view.state';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ViewComponent } from './features/view/components/routables/view.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RefConfigState } from './shared/stores/ref-config-edit/ref-config.state';

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [
        provideClientHydration(),
        provideRouter([
            {component: ViewComponent, path: 'view'}    // makes @Input() work on ViewComponent...
        ],
        withComponentInputBinding()),
        provideAnimationsAsync()
        
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxsModule.forRoot([
            AppState,
            RefViewState,
            RefConfigState
        ]),
        NgxsReduxDevtoolsPluginModule,
        NgxsLoggerPluginModule,
        NavbarComponent
    ]
})
export class AppModule { }
