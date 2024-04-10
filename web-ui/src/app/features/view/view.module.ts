import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoutingModule } from './view-routing.module';
import { ViewComponent } from './components/routables/view.component';
import { ViewContainerComponent } from './components/containers/view-container.component';
import { TableComponent } from "./components/presentationals/table/table.component";
import { SearchComponent } from "./components/presentationals/search/search.component";
import { ViewEditorComponent } from "./components/presentationals/view-edit/view-editor.component";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
    declarations: [
        ViewComponent,
        ViewContainerComponent
    ],
    exports: [
        ViewContainerComponent,
        TableComponent
    ],
    imports: [
        CommonModule,
        ViewRoutingModule,
        TableComponent,
        SearchComponent,
        ViewEditorComponent,
        MatGridListModule,
        MatButtonModule,
        FormsModule, 
        MatFormFieldModule, 
        MatInputModule,
        MatSelectModule
    ]
})
export class ViewModule { }
