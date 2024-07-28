import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Papa from 'papaparse';
import { ActivatedRoute, Router } from '@angular/router';
import { Referential } from '../../../../shared/models/referential.model';
import { Record, Entry } from '../../../../shared/models/record.model';
import { RefService } from '../../../../shared/services/ref.service';
import { Colfig } from '../../../../shared/models/Colfig.model';
import { Observable, concat, concatAll, forkJoin, merge } from 'rxjs';
import { ColfigService } from '../../../../shared/services/colfig.service';
import { EntryService } from '../../../../shared/services/entry.service';
import { ViewService } from '../../../../shared/services/view.service';
import { View } from '../../../../shared/models/view.model';
import moment from 'moment';

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
      code: this.Ref.code,
      description: this.Ref.description,
      columns: this.fb.array([])  // contains all the colfigs.
    });
    this.addColFormsFor(this.Ref);  // re-add col config fields
  }

  getColfigGroupOf(id: string, colType: string, required: boolean, dateFormat: string, name: string,
    fileColName: string, pointedrefid: string, pointedRefColId: string, pointedRefColLabelId: string) {
    return this.fb.group({
      id: id,
      colType: colType,
      required: required,
      dateFormat: dateFormat,
      name: name.toUpperCase(),
      fileColName: fileColName,
      pointedrefid: pointedrefid,
      pointedRefColId: pointedRefColId,
      pointedRefColLabelId: pointedRefColLabelId,
    })
  }

  addColFormsFor(ref: Referential) {
    for (let colfig of ref.columns) {
      this.columns.push(
        this.getColfigGroupOf(
          colfig.id, colfig.colType, colfig.required, colfig.dateFormat,
          colfig.name, colfig.fileColName, colfig.pointedrefid,
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

  PostDefaultViewOf(refid: string) {
    this.rs.getReferentialBy(refid).subscribe((ref) => {      // POST default FULL_VIEW...
      let dispColIds = []

      for (let colfig of ref.columns)
        dispColIds.push(colfig.id);

      let defaultView = new View();
      defaultView.refid = ref.id;
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
  PostCSVEntriesOf(refid: string) {
    this.rs.getReferentialBy(refid).subscribe((ref) => {
      // if a date format is provided, check format is valid for all entries before posting. 
      for(let record of this.records) {
        for (let colfig of ref.columns) {   // https://momentjs.com/docs/#/parsing/string-format/   
          if(colfig.dateFormat != null) {   // if it's a date, check provided format is valid.
            let d = moment(record[colfig.fileColName], colfig.dateFormat);
            if(!d.isValid()) {
              throw new Error(`Format de date (${colfig.dateFormat}) spécifié non respecté par valeur ${record[colfig.fileColName]}.`);
            }
          }
        }
      }

      /*
      for (let record of this.records) {
        const entry: Entry = new Entry();
        entry.refid = refid;
        entry.fields = {};

        for (let colfig of ref.columns) {   
          console.log(colfig);
          entry.fields[colfig.id] = record[colfig.fileColName];
        }

        console.log("POST :", entry);
        this.es.postEntry(entry).subscribe((newEntry) => {
          console.log("Posted Entry :", newEntry);
        });
      }
        */
    })
  }

  UpdateColfigsOf(refid: string): Observable<Colfig> {
    let refconfig: any = this.RefConfigForm.getRawValue();
    let createdColfigObservables: Observable<Colfig>[] = [];

    for (let colfig of refconfig['columns']) {
      colfig.refid = refid;                                       // create or update every column config
      createdColfigObservables.push(this.cs.postColfig(colfig));  // TODO : this should be a PUT to handle updating of columns...
    }

    let res = concat(...createdColfigObservables); // creates a single observable, that emits every colfig as they're posted.
    return res;                  
  }

  handleColfigUpdateError(error: any) {
    throw error;    // TODO : the colfig update error will need to be passed to the appropriate Colfig presentational component to display errors to user.
  }

  handleUpdateColfigOf(refId: string) {
    this.UpdateColfigsOf(refId).subscribe({
      next: (uColfig) => {
        console.log("Posted ", uColfig);
      },                                          // TODO : to be able to implement DATE issue completely, we need to be able to update columns.
      error: (err) => {                           // TODO : Add PUT endpoint for updating / posting columns. This will handle the cases of
        this.handleColfigUpdateError(err.error);  // checking unicity of column we set as unique afterwards, or column we set as date afterwards (when lines are already present)
      },
      complete: () => {
        console.log("Done posting all columns."); 
        if(this.Ref.id === undefined) {         // if this is a new referential, post the entries and create a default view.
          this.PostCSVEntriesOf(refId);
          this.PostDefaultViewOf(refId);
        }
      }
    })
  }

  handleRefUpdateError(error: Error) {
    this.ErrorMap = JSON.parse(error.message);
  }

  ErrorMap: Record = {};

  UpdateReferential() {
    let refconfig: any = this.RefConfigForm.getRawValue();
    console.log(refconfig);
    
    this.Ref.name = refconfig['name'];
    this.Ref.description = refconfig['description'] || "";
    this.Ref.code = refconfig['code'];

    this.rs.putReferential(this.Ref).subscribe({
      next: (uRef) => this.handleUpdateColfigOf(uRef.id),   // uRef is either an new referential or an existing, updated one
      error: (err) => this.handleRefUpdateError(err.error)
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
        colfig.name = colName.toUpperCase().trim().replace(" ", "_");
        colfig.colType = "NONE";
        colfig.required = false;
        this.Ref.columns.push(colfig);      // TODO : don't forget to add refid to every column (first post Ref, then get id from response)
      }

      this.RefConfigForm.controls['name'].setValue(this.file!.name);

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

