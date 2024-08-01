import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InjecEditRoutingModule } from './injec-edit-routing.module';
import { Store } from '@ngxs/store';
import { InjecEditRoutableComponent } from './routables/injec-edit-routable.component';
import { MappingConfigPresentationalComponent } from './presentationals/mapping-config-presentational.component';
import { InjectionEditContainerComponent } from './containers/injection-edit-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    InjecEditRoutableComponent,
    MappingConfigPresentationalComponent,
    InjectionEditContainerComponent
  ],
  imports: [
    CommonModule,
    InjecEditRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class InjecEditModule {


  constructor(private store: Store) {}

}
