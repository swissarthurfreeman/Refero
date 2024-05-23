import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportRoutingModule } from './ref-import-routing.module';
import { RefImportRoutableComponent } from './components/routables/ref-import-routable.component';
import { RefImportContainerComponent } from './components/containers/ref-import-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    RefImportRoutableComponent,
    RefImportContainerComponent
  ],
  imports: [
    CommonModule,
    ImportRoutingModule,
    CommonModule,
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
export class RefImportModule { }
