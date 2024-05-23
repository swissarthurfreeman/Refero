import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Papa, { LocalChunkSize } from 'papaparse';
import { ActivatedRoute, Router } from '@angular/router';
import { Referential } from '../../../../shared/models/referential.model';
import { Record, Entry } from '../../../../shared/models/record.model';
import { RefService } from '../../../../shared/services/ref.service';
import { Colfig } from '../../../../shared/models/Colfig.model';
import { Observable, forkJoin } from 'rxjs';
import { ColfigService } from '../../../../shared/services/colfig.service';
import { EntryService } from '../../../../shared/services/entry.service';
import { ViewService } from '../../../../shared/services/view.service';
import { View } from '../../../../shared/models/view.model';

/* TODO : there are multiple bugs here 
    - remove the Ref input if you can
    - 
*/

@Component({
  selector: 'app-ref-config-edit-container',
  styleUrl: './ref-config-edit-container.component.scss',
  templateUrl: './ref-config-edit-container.component.html'
})
export class RefConfigEditContainerComponent implements OnInit {
  @Input() Ref!: Referential;   // Ref whose config we're reading, either an existent ref or an empty one (if creating new).
  RefConfigForm!: FormGroup;    // Parent Form, contains the name, description and columns formArray. 

  constructor(private rs: RefService, private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute,
    public cs: ColfigService, public es: EntryService,
    public vs: ViewService) { }

  ngOnInit(): void {
    this.RefConfigForm = this.fb.group({
      name: this.Ref.name,
      description: this.Ref.description,
      columns: this.fb.array([])  // contains all the colfigs.
    });
    this.addColFormsFor(this.Ref);  // re-add col config fields
  }

  getColfigGroupOf(id: string, colType: string, required: boolean, dateFormat: string, name: string,
    fileColName: string, pointedRefId: string, pointedRefColId: string, pointedRefColLabelId: string) {
    return this.fb.group({
      id: id,
      colType: colType,
      required: required,
      dateFormat: dateFormat,
      name: name.toUpperCase(),
      fileColName: fileColName,
      pointedRefId: pointedRefId,
      pointedRefColId: pointedRefColId,
      pointedRefColLabelId: pointedRefColLabelId,
    })
  }

  addColFormsFor(ref: Referential) {
    for (let colfig of ref.columns) {
      if(colfig.name === "STATUS") {
        console.log(colfig);
      }

      this.columns.push(
        this.getColfigGroupOf(
          colfig.id, colfig.colType, colfig.required, colfig.dateFormat,
          colfig.name, colfig.fileColName, colfig.pointedRefId,
          colfig.pointedRefColId, colfig.pointedRefColLabelId
        )
      );
    }
  }

  AddColToFormArray() {
    this.columns.push(this.getColfigGroupOf('', 'NONE', true, '', '', '', '', '', ''));
  }

  get columns() {
    return this.RefConfigForm.controls["columns"] as FormArray;
  }

  PostDefaultViewOf(refId: string) {
    this.rs.getReferentialBy(refId).subscribe((ref) => {      // POST default FULL_VIEW...
      let dispColIds = []

      for (let colfig of ref.columns)
        dispColIds.push(colfig.id);

      let defaultView = new View();
      defaultView.ref_id = ref.id;
      defaultView.name = "DEFAULT_VIEW";

      defaultView.dispColIds = dispColIds;
      defaultView.searchColIds = dispColIds;

      this.vs.postView(defaultView).subscribe((view) => {
        console.log("Posted default view :", view);
      })
    })
  }

  /**
   * Post all entries read from CSV. 
   * @param ref the newly created referential.
   */
  PostCSVEntriesOf(refId: string) {
    this.rs.getReferentialBy(refId).subscribe((ref) => {
      for (let record of this.records) {
        const entry: Entry = new Entry();
        entry.ref_id = refId;
        entry.fields = {};

        for (let colfig of ref.columns) {
          entry.fields[colfig.id] = record[colfig.fileColName];
        }
        this.es.postEntry(entry).subscribe((newEntry) => {
          console.log("Posted Entry :", newEntry);
        });
      }
    })
  }

  UpdateColfigsOf(refId: string): Observable<Colfig[]> {
    let refconfig: any = this.RefConfigForm.getRawValue();
    let createdColfigObservables: Observable<Colfig>[] = [];

    for (let colfig of refconfig['columns']) {
      colfig.ref_id = refId;                                     // create or update every column config
      createdColfigObservables.push(this.cs.postColfig(colfig));
    }

    return forkJoin(createdColfigObservables);                  // emits when all post requests have been completed
  }

  UpdateReferential() {
    let refconfig: any = this.RefConfigForm.getRawValue();

    this.Ref.name = refconfig['name'];                      // manualy populate formcontrols for this to work
    this.Ref.description = refconfig['description'];

    this.rs.putReferential(this.Ref).subscribe((uRef) => {  // uRef is either an new referential or an existing, updated one
      this.UpdateColfigsOf(uRef.id).subscribe((uColfigs) => {
        if(this.Ref.id === undefined) {                     // if this is a new referential, post the entries and create a default view.
          this.PostCSVEntriesOf(uRef.id);
          this.PostDefaultViewOf(uRef.id);
        }
      })
    })
  }

  EditInjection() {
    this.router.navigate(['injections'], { relativeTo: this.route });
  }

  deleteColumn(idx: number) {
    this.columns.removeAt(idx);
  }

  Debug() {
    console.log(JSON.stringify(this.RefConfigForm.getRawValue()));
  }

  file: File | undefined = undefined;

  upload(event: any) {

    let file: File = event.target.files[0];
    this.file = file;
    file.text().then(value => {

      let parsedCSV = Papa.parse(value, { header: true });
      // TODO : Deal with case where no header is provided

      let originalHeader: string[] = parsedCSV.meta.fields!;                  // these are the original column names
      for (let colName of originalHeader) {
        let colfig = new Colfig();
        colfig.fileColName = colName;
        colfig.name = colName.toUpperCase(); // TODO : deal with spaces, special characters etc
        colfig.colType = "NONE";
        colfig.required = true;
        this.Ref.columns.push(colfig);      // TODO : don't forget to add ref_id to every column (first post Ref, then get id from response)
      }

      this.Ref.name = this.file!.name;

      parsedCSV.data.pop()  // pop crap at end
      let records = parsedCSV.data as Record[];

      this.records = records;

      this.addColFormsFor(this.Ref);  // TODO : revamp to just adding for a single colfig, cycle before. 
    });
  }

  records: Record[] = [];

  getDispFileColNames() {
    let fileColNames = []
    for (let colfig of this.Ref.columns) {
      fileColNames.push(colfig.fileColName);
    }
    return fileColNames;
  }
}

