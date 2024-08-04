import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoutingModule } from './view-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewRoutableComponent } from './routables/view-routable.component';
import { ViewContainerComponent } from './containers/view-container.component';
import { SearchComponent } from './presentationals/search/search.component';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { ViewEditorComponent } from './presentationals/view-edit/view-editor.component';
import { TableComponent } from './presentationals/table/table.component';


@NgModule({
    declarations: [
        ViewRoutableComponent,
        ViewContainerComponent,
        ViewEditorComponent,
        SearchComponent,
        TableComponent
    ],
    exports: [
        ViewContainerComponent,
        TableComponent,
        SearchComponent,
        MatInputModule,
        ViewEditorComponent
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        ViewRoutingModule,
        MatGridListModule,
        MatButtonModule,
        FormsModule,
        MatSelectModule,
        MatIconModule,
        MatTableModule,
        MatDividerModule,
        ReactiveFormsModule
    ]
})
export class ViewModule { }
