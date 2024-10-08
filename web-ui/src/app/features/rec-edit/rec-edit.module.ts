import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecEditRoutingModule } from './rec-edit-routing.module';
import { RecEditContainerComponent } from './components/containers/rec-edit-container.component';
import { InjectionPanelPresentationalComponent } from './components/presentationals/injection-panel/injection-panel-presentational.component';
import { KeyValuePresentationalComponent } from './components/presentationals/key-value/key-value-presentational.component';
import { RecEditRoutableComponent } from './components/routables/rec-edit-routable.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ViewModule } from '../view/view.module';


@NgModule({
    declarations: [
        RecEditContainerComponent,
        KeyValuePresentationalComponent,
        InjectionPanelPresentationalComponent,
        RecEditRoutableComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RecEditRoutingModule,
        MatGridListModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatSelectModule,
        MatDividerModule,
        MatButtonModule,
        ViewModule
    ],
    exports: [
        KeyValuePresentationalComponent
    ]
})
export class RecEditModule { }
