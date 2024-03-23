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
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColConfigComponent } from "../col-config/col-config.component";
import Papa from 'papaparse';
import { Referential } from '../../model/referential.model';
import { v4 as uuidv4 } from 'uuid';
import { RefDataService } from '../../service/ref-data.service';

@Component({
    selector: 'app-ref-creation',
    standalone: true,
    templateUrl: './ref-creation.component.html',
    imports: [CommonModule, MatTableModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule, ViewEditorComponent, SearchComponent, TableComponent, ColConfigComponent]
})
export class RefCreationComponent implements OnInit {
  RefConfigForm = this.fb.group({
      name: this.fb.control(''),
      description: this.fb.control(''),
      columns: this.fb.array([])
  });

  constructor(private fb:FormBuilder) {}
  
  FileCols: Array<string> = ['Code', 'Parent', 'Level', 'Name_fr', 'Desc_fr'];
  ngOnInit(): void {
    for(let col of this.FileCols) {
      this.AddCol(col);
    }
  }

  get columns() {
    return this.RefConfigForm.controls["columns"] as FormArray;
  }

  AddCol(name?: string) {
    const ColForm = this.fb.group({
      RefCol: ['' || name?.toUpperCase(), Validators.required],
      FileCol: ['' || name ],
      DateFormat: [''],
      Required: ["true"],
      KeyType: ['None'],
      PointedRef: [''],
      PointedCol: [''],
      LabelCol: ['']
    });
    this.columns.push(ColForm);
  }

  deleteColumn(idx: number) {
    this.columns.removeAt(idx);
  }

  Debug() {
    console.log(JSON.stringify(this.RefConfigForm.getRawValue()));
  }

  selectedFiles!: NodeList;
  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  dataService = inject(RefDataService);

  upload(event: any){
    let file: File = event.target.files[0];

    file.text().then(
      value => {
        let parsedCSV = Papa.parse(value, {header: true});
        let header = parsedCSV.meta.fields!;  // TODO : Deal with case where no header is provided.
        let lines = parsedCSV.data as Object[];
        //let ref = new Referential(uuidv4(), file.name, "", lines,  this.dataService.getHeaderConfig(header));
    });
    
 }
}
