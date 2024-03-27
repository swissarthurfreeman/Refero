import { Component, Input, OnInit, inject } from '@angular/core';
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
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Papa from 'papaparse';
import { Referential, Dictionary } from '../../model/referential.model';
import { RefDataService } from '../../service/ref-data.service';
import { ColConfigComponent } from '../col-config/col-config.component';

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
    selector: 'app-ref-edit',
    standalone: true,
    styleUrl: './ref-edit.component.scss',
    templateUrl: './ref-edit.component.html',
    imports: [CommonModule, MatTableModule, ReactiveFormsModule,
       MatFormFieldModule, MatSelectModule, MatButtonModule, 
       MatDividerModule, MatIconModule, MatGridListModule, 
       MatInputModule, ViewEditorComponent, SearchComponent, 
       TableComponent, ColConfigComponent]
})
export class RefEditComponent implements OnInit {
  
  RefConfigForm: FormGroup;
  constructor(private fb: FormBuilder, private dataService: RefDataService) {
    this.RefConfigForm = this.fb.group({
      name: this.fb.control(this.Ref.name),
      description: this.fb.control(this.Ref.description),
      columns: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // TODO : add scenario when we edit a referential created without a source file. 
    this.addColFormsFor(Object.values(this.Ref.originalHeader), this.Ref.headerIds)
  }
  
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

  CreateReferential() {
    console.log("Creating Ref");
    this.dataService.createRef(this.Ref);
  }

  file: File | undefined = undefined;

  Ref: Referential = this.dataService.getCurrentRef();  // communication with home / consultation component
  
  upload(event: any) {
    let file: File = event.target.files[0];
    this.file = file;
    file.text().then(
      value => {
        let parsedCSV = Papa.parse(value, {header: true});
        // TODO : Deal with case where no header is provided
        let originalHeader: string[] = parsedCSV.meta.fields!;                  // these are the original column names
        let lines = parsedCSV.data as Dictionary<string>[];
        console.log(originalHeader);
        this.Ref = new Referential(file.name.toUpperCase(), "", lines,  originalHeader);
        this.Ref.currView.setDispColsToAllCols();
    
        this.addColFormsFor(originalHeader, this.Ref.headerIds);
    });
  }

  addColFormsFor(originalHeader: string[], headerIds: string[]) {
    for(let i=0; i < headerIds.length; i++) {
      this.AddColToFormArray(originalHeader[i], headerIds[i]);
    }
  }
}
