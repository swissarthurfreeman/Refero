import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RefConfigEditRoutingModule } from './ref-config-edit-routing.module';
import { RefConfigEditRoutableComponent } from './components/routables/ref-config-edit-routable.component';
import { ColConfigPresentationalComponent } from './components/presentationals/col-config/col-config-presentational.component';
import { DescConfigPresentationalComponent } from './components/presentationals/desc-config/desc-config-presentational.component';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ViewModule } from '../view/view.module';
import { RefConfigEditContainerComponent } from './components/containers/ref-config-edit-container.component';


@NgModule({
    declarations: [
        RefConfigEditRoutableComponent,
        RefConfigEditContainerComponent,
        ColConfigPresentationalComponent,
        DescConfigPresentationalComponent
    ],
    imports: [
        CommonModule,
        ViewModule,
        RefConfigEditRoutingModule,
        MatTableModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatGridListModule,
        MatInputModule
    ]
})
export class RefConfigEditModule { }
