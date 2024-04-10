import { Component, Input, OnInit } from '@angular/core';
import { RefConfigState } from '../../../../shared/stores/ref-config-edit/ref-config.state';
import { Dictionary, Referential } from '../../../../shared/models/referential.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefService } from '../../../../shared/services/ref.service';
import Papa from 'papaparse';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ref-config-edit-container',
  templateUrl: './ref-config-edit-container.component.html'
})
export class RefConfigEditContainerComponent implements OnInit {
  @Input() Ref!: Referential;
  RefConfigForm: FormGroup = this.fb.group({});

  constructor(private rs: RefService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.RefConfigForm = this.fb.group({
      name: this.fb.control(this.Ref.name),
      description: this.fb.control(this.Ref.description),
      columns: this.fb.array([])
    });
    this.addColFormsFor(Object.values(this.Ref.originalHeader), this.Ref.headerIds);  // re-add col config fields
  }

  CreateReferential() {
    this.rs.createRef(this.Ref);
  }

  addColFormsFor(originalHeader: string[], headerIds: string[]) {
    for(let i=0; i < headerIds.length; i++) {
      this.AddColToFormArray(originalHeader[i], headerIds[i]);
    }
  }

  EditInjection() {
    this.router.navigate(['injections'], {relativeTo: this.route});
  }

  deleteColumn(idx: number) {
    this.columns.removeAt(idx);
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

  Debug() {
    console.log(JSON.stringify(this.RefConfigForm.getRawValue()));
  }

  file: File | undefined = undefined;
  
  upload(event: any) {
    let file: File = event.target.files[0];
    this.file = file;
    file.text().then(
      value => {
        let parsedCSV = Papa.parse(value, {header: true});
        // TODO : Deal with case where no header is provided
        let originalHeader: string[] = parsedCSV.meta.fields!;                  // these are the original column names
        let lines = parsedCSV.data as Dictionary<string>[];

        this.Ref = new Referential(file.name.toUpperCase(), "", lines,  originalHeader);
        this.Ref.currView.setDispColsToAllCols();
        // this.rs.setCurrentRef(this.Ref); // to communicate with injection view

        this.addColFormsFor(originalHeader, this.Ref.headerIds);
    });
  }
}

