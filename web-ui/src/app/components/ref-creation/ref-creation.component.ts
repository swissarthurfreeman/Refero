import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { ViewEditorComponent } from "../view-editor/view-editor.component";
import { SearchComponent } from "../search/search.component";
import { TableComponent } from "../table/table.component";
import { ColConfigComponent } from "../col-config/col-config.component";
import { RefDataService } from '../../service/ref-data.service';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-ref-creation',
    standalone: true,
    templateUrl: './ref-creation.component.html',
    imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule, ViewEditorComponent, SearchComponent, TableComponent, ColConfigComponent]
})
export class RefCreationComponent implements OnInit {
  constructor() {

  }

  dataService = inject(RefDataService);

  fileHeader: Array<string> = ['Code', 'Parent', 'Level', 'Name_fr', 'Desc_fr'];

  newHeader: Array<string> = [];
  AddCol(event: any) {
    this.newHeader.push("");
  }

  ngOnInit(): void {
  }  
}
