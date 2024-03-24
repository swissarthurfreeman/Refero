import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { ViewEditorComponent } from "../view-editor/view-editor.component";
import { SearchComponent } from "../search/search.component";
import { TableComponent } from "../table/table.component";
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColConfigComponent } from "../col-config/col-config.component";
import Papa from 'papaparse';
import { Referential, Dictionary } from '../../model/referential.model';
import { v4 as uuidv4 } from 'uuid';
import { RefDataService } from '../../service/ref-data.service';

/**
 * This component manages a FormArray : every column config component is a form, 
 * and there is an unknown arbitrary amount of them to be specified by the user.
 * 
 * Members of note are `RefConfigForm` which is a form group that contains the
 * new referential name, description and defined columns. `AddCol()` which adds
 * a column configuration component to the view and `upload()` which allows the
 * uploading of a csv file. 
 */
@Component({
    selector: 'app-ref-creation',
    standalone: true,
    styleUrl: './ref-creation.component.scss',
    templateUrl: './ref-creation.component.html',
    imports: [CommonModule, MatTableModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule, ViewEditorComponent, SearchComponent, TableComponent, ColConfigComponent]
})
export class RefCreationComponent {
  RefConfigForm = this.fb.group({
      name: this.fb.control(''),
      description: this.fb.control(''),
      columns: this.fb.array([])
  });

  constructor(private fb: FormBuilder) {}

  get columns() {
    return this.RefConfigForm.controls["columns"] as FormArray;
  }

  AddColToFormArray(colName?: string, colId?: string) {
    const ColForm = this.fb.group({
      RefCol: ['' || colName?.toUpperCase(), Validators.required],
      FileCol: ['' || colName ],
      DateFormat: [''],
      Required: ["true"],
      KeyType: ['None'],
      PointedRef: [''],
      PointedCol: [''],
      LabelCol: [''],
      ColId: [''|| colId] // this value is needed to be able to associate column config to ColId of referential under creation 
    });
    this.columns.push(ColForm);
  }

  deleteColumn(idx: number) {
    this.columns.removeAt(idx);
  }

  Debug() {
    console.log(JSON.stringify(this.RefConfigForm.getRawValue()));
  }

  dataService = inject(RefDataService);

  newRef: Referential = new Referential('', '', [], []); 

  upload(event: any) {
    let file: File = event.target.files[0];

    file.text().then(
      value => {
        let parsedCSV = Papa.parse(value, {header: true});
        let header = parsedCSV.meta.fields!;  // TODO : Deal with case where no header is provided.
        let lines = parsedCSV.data as Dictionary<string>[];
        this.newRef = new Referential(file.name, "", lines,  header);
        this.newRef.currView.setDispColsToAllCols();

        for(let colId of Object.keys(this.newRef.header)) {
          this.AddColToFormArray(this.newRef.header[colId], colId);
        }
    });
  }
}
