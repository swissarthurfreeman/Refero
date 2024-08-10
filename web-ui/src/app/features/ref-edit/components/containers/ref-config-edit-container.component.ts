import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import Papa from 'papaparse';
import {ActivatedRoute, Router} from '@angular/router';
import {Referential} from '../../../../shared/models/referential.model';
import {Entry, Record} from '../../../../shared/models/record.model';
import {RefService} from '../../../../shared/services/ref.service';
import {Colfig} from '../../../../shared/models/Colfig.model';
import {concat, Observable} from 'rxjs';
import {ColfigService} from '../../../../shared/services/colfig.service';
import {EntryService} from '../../../../shared/services/entry.service';
import {ViewService} from '../../../../shared/services/view.service';
import {v4 as uuid} from 'uuid';
import {Location} from "@angular/common";

export interface ColfigConfigForm {
  dateformat: FormControl<string | null>
  pointedrefcolid: FormControl<string | null>
  coltype: FormControl<string>
  name: FormControl<string>
  filecolname: FormControl<string | null>
  pointedrefcollabelids: FormArray<FormControl<string>>,
  id: FormControl<string>
  refid: FormControl<string>
  required: FormControl<boolean>
  pointedrefid: FormControl<string | null>
}

interface ReferentialConfigForm {
  code: FormControl<string>,
  name: FormControl<string>,
  description: FormControl<string>,
  colfigs: FormArray<FormGroup<ColfigConfigForm>>
}


/* TODO : there are multiple bugs here
    accordingly and loads the container for this referential.
    - code review the shit out of this component, it's size is gargantuan.
    - why are we distinguishing post from put ? Why not just assign a UUID to a non existent ref
    and use put everywhere creating when it doesn't exist...?
    - note colfig ids are either already present (existing ref) or get assigned either when
    uploading a CSV and adding all colfigs, or when manually adding a column via + button.
*/

@Component({
  selector: 'app-ref-config-edit-container',
  styleUrl: './ref-config-edit-container.component.scss',
  templateUrl: './ref-config-edit-container.component.html'
})
export class RefConfigEditContainerComponent implements OnInit {
  @Input() Ref!: Referential;   // Ref whose config we're reading, either an existent ref or an empty one (if creating new).
  RefConfigForm!: FormGroup<ReferentialConfigForm>;    // Parent Form, contains the name, description and columns formArray.

  csvFile: File | undefined = undefined;

  RefErrorMap: Record = {};
  ColfigErrorMap: any = {};

  records: Record[] = [];

  constructor(private rs: RefService, private router: Router, private route: ActivatedRoute,
              public cs: ColfigService, public es: EntryService,
              public vs: ViewService, public location: Location,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.RefConfigForm = new FormGroup<ReferentialConfigForm>({
      name: new FormControl(this.Ref.name, {nonNullable: true}),
      code: new FormControl(this.Ref.code, {nonNullable: true}),
      description: new FormControl(this.Ref.description, {nonNullable: true}),
      colfigs: new FormArray<FormGroup<ColfigConfigForm>>([])  // contains all the Colfig FormControls.
    })
    this.addColumnFormGroupsToFormArrayFor(this.Ref);        // add colfig fields
  }

  private getFormControlGroupOf(col: Colfig) {
    return new FormGroup<ColfigConfigForm>({
      id: new FormControl(col.id, {nonNullable: true}),
      name: new FormControl(col.name, {nonNullable: true}),
      refid: new FormControl(col.refid, {nonNullable: true}),
      coltype: new FormControl(col.coltype, {nonNullable: true}),
      required: new FormControl(col.required, {nonNullable: true}),
      dateformat: new FormControl(col.dateformat),
      filecolname: new FormControl(col.filecolname),
      pointedrefid: new FormControl(col.pointedrefid),
      pointedrefcolid: new FormControl(col.pointedrefcolid),
      pointedrefcollabelids: new FormArray<FormControl<string>>(this.getFormControlArrayOf(col.pointedrefcollabelids || [])),
    })
  }

  private getFormControlArrayOf(pointedrefcollabelids: string[]): FormControl<string>[] {
    const controls: FormControl<string>[] = [];
    for (let val of pointedrefcollabelids) {
      controls.push(new FormControl(val, {nonNullable: true}))
    }
    return controls;
  }

  private getColfigOf(colfigFormGroup: FormGroup<ColfigConfigForm>): Colfig {
    const colfig = new Colfig();
    colfig.id = colfigFormGroup.controls.id.getRawValue()!;
    colfig.required = colfigFormGroup.controls.required.getRawValue() || false;
    colfig.refid = colfigFormGroup.controls.refid.getRawValue()!;
    colfig.dateformat = colfigFormGroup.controls.dateformat.getRawValue()!;
    colfig.coltype = colfigFormGroup.controls.coltype.getRawValue()!;
    colfig.filecolname = colfigFormGroup.controls.filecolname.getRawValue()!;
    colfig.name = colfigFormGroup.controls.name.getRawValue() || "";
    colfig.pointedrefid = colfigFormGroup.controls.pointedrefid.getRawValue()!;
    colfig.pointedrefcolid = colfigFormGroup.controls.pointedrefcolid.getRawValue()!;

    colfig.pointedrefcollabelids = [];
    for (let val of colfigFormGroup.controls.pointedrefcollabelids.controls) {
      colfig.pointedrefcollabelids.push(val.getRawValue());
    }
    return colfig;
  }

  /**
   * Add colfig form groups for every colfig of referential.
   * @param ref either a newly created referential from a file, or an inputted referential
   * retrieved from the backend by the routable.
   */
  private addColumnFormGroupsToFormArrayFor(ref: Referential) {
    for (let colfig of ref.columns)
      this.RefConfigForm.controls.colfigs.push(this.getFormControlGroupOf(colfig));
  }

  /**
   * Add a new column un-required column of type NONE to the referential configuration with a new colfig id.
   */
  AddNewColfigToFormArray() {
    let colfig: Colfig = new Colfig();
    colfig.refid = this.Ref.id;
    colfig.required = false;
    colfig.coltype = "NONE";
    colfig.id = uuid().toString();
    this.RefConfigForm.controls.colfigs.push(this.getFormControlGroupOf(colfig));
  }

  /**
   * Save (update or create) the referential by sending its current configuration to the backend.
   * The method will trigger a large callstack, putReferential(Ref.id, Ref) ->
   * handleUpdateColfigOfRef() -> UpdateColfigsOfRef() -> PutDefaultViewForRef()
   * -> PutCSVEntriesOfRef().
   */
  SaveReferential() {
    this.Ref.code = this.RefConfigForm.controls.code.getRawValue() || '';
    this.Ref.name = this.RefConfigForm.controls.name.getRawValue() || '';
    this.Ref.description = this.RefConfigForm.controls.description.getRawValue() || '';

    this.rs.putReferential(this.Ref.id, this.Ref).subscribe({
      next: (uRef) => this.handleUpdateColfigOfRef(),
      error: (httpErr) => {
        this.RefErrorMap = httpErr.error
      }
    })
  }

  private handleUpdateColfigOfRef() {
    this.ColfigErrorMap = {};   // empty colfig error map.
    this.UpdateColfigsOfRef().subscribe({
      next: (uColfig) => {
        console.log("Posted :", uColfig);
      },                                          // TODO : to be able to implement DATE issue completely, we need to be able to update columns.
      error: (err) => {                     // TODO : Add PUT endpoint for updating / posting columns. This will handle the cases of
        // checking unicity of column we set as unique afterward, or column we set as date afterward (when lines are already present)
        this.ColfigErrorMap[(err['url']! as string)!.split('/').pop()!] = err.error;
        console.log(this.ColfigErrorMap);
      },
      complete: () => {

        console.log("Done posting all columns.");
        // create default view, which then posts all new entries, won't do anything if ref already exists.
        if (Object.keys(this.ColfigErrorMap).length == 0) {
          this.PostDefaultViewForRef();
        }
      }
    })
  }

  /**
   * PUT all columns of Ref, concatenate all individual observables into a single
   * one that emits every PUT response.
   */
  UpdateColfigsOfRef(): Observable<Colfig> {
    let createdColfigObservables: Observable<Colfig>[] = [];

    for (let colfigFormGroup of this.RefConfigForm.controls.colfigs.controls) {
      const colfig: Colfig = this.getColfigOf(colfigFormGroup)
      createdColfigObservables.push(this.cs.putColfig(colfig.id, colfig));    // colfig is either existing Id or new one (from file upload or manual add)
    }

    return concat(...createdColfigObservables);  // creates a single observable, that emits every colfig as they're posted.
  }

  PostDefaultViewForRef() {
    this.rs.getReferentialBy(this.Ref.id).subscribe((uRef) => {
      this.vs.postView(this.vs.getDefaultViewFor(uRef)).subscribe({
        next: value => {
          console.log("Posted :", value);
          this.PutCSVEntriesOf(uRef);      // does nothing if no file was read.
        },
        error: httpError => {
          if (!httpError.error.name) {
            throw httpError;
          }
        }
      });
    })
  }

  /**
   * Post all entries read from CSV, if a file wasn't read, this method will do nothing.
   * Before doing this basic validation needs to be done upon
   * the CSV, see gitlab. https://momentjs.com/docs/#/parsing/string-format/
   * @param uRef the newly created referential, with a valid array of columns.
   */
  PutCSVEntriesOf(uRef: Referential) {
    // if a date format is provided, check format is valid for all entries before posting.
    for (let record of this.records) {
      const entry: Entry = new Entry();
      entry.refid = this.Ref.id;
      entry.fields = {};

      for (let colfig of uRef.columns) {
        entry.fields[colfig.id] = record[colfig.filecolname];
      }

      this.es.postEntry(entry).subscribe({
        next: value => {
          console.log("Posted :", value)
        },
        error: err => {
          throw err
        },
        complete: () => {
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          })
        }
      });
    } // this.router.navigate([this.Ref.id], {relativeTo: this.route}).then(() => window.location.reload())
    // TODO : concat all entry observables into a single observable and navigate away once it's completed (use concat)
  }

  Debug() {
    console.log(JSON.stringify(this.RefConfigForm.getRawValue()));
  }

  upload(event: any) {
    let file: File = event.target.files[0];
    this.csvFile = file;

    file.text().then(value => {
      let parsedCSV = Papa.parse(value, {header: true});  // TODO : Deal with case where no header is provided
      let originalHeader: string[] = parsedCSV.meta.fields!;                          // original column names

      for (let colName of originalHeader) {
        let colfig = new Colfig();
        colfig.id = uuid().toString();
        colfig.refid = this.Ref.id;
        colfig.filecolname = colName;
        colfig.name = colName.toUpperCase().trim().replace(" ", "_");
        colfig.coltype = "NONE";
        colfig.required = false;
        this.Ref.columns.push(colfig);
      }

      this.RefConfigForm.controls.name.setValue(this.csvFile!.name);

      parsedCSV.data.pop()  // pop crap at end.
      this.records = parsedCSV.data as Record[];

      this.addColumnFormGroupsToFormArrayFor(this.Ref);
    });
  }

  EditInjections() {
    this.router.navigate(['injections'], {relativeTo: this.route});
  }

  getFileColNamesOfConfig(): Array<String> {
    let fileColNames = [];
    for (let colfigForm of this.RefConfigForm.controls.colfigs.controls) {
      if (colfigForm.controls.filecolname.getRawValue()) {
        fileColNames.push(colfigForm.controls.filecolname.getRawValue()!);
      }
    }
    return fileColNames;
  }

  DeleteRef(ref: Referential) {
    if (confirm(
      `Êtes vous sur de vouloir supprimer le référentiel suivant ? \n ${ref.name}
      \nCette action supprimera toutes les lignes, vues, injections et colonnes du référentiel et est irréversible !\n
      Veuillez faire les sauvegardes appropriées.`)) {
      this.rs.delReferential(ref.id).subscribe(() => {
        this.router.navigate(["/"]);
      })
    }
  }

  deleteColumn(colId: string, index: number) {
    if (confirm(`Ẽtes vous sûr de vouloir supprimer cette colonne ? \n
    Cette action est irréversible, et enlevera la colonne de chaque vue, injection et entrée y faisant référence.`)) {
      this.cs.delColfig(colId).subscribe({
        next: () => {
          this.RefConfigForm.controls.colfigs.removeAt(index);
          this.cd.detectChanges();
        },
        error: (err) => {
          if (err.status != 404) {
            throw err;
          } else {
            this.RefConfigForm.controls.colfigs.removeAt(index);
          }
        }
      });
    }
  }
}

