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

@Component({
  selector: 'app-ref-config-edit-container',
  styleUrl: './ref-config-edit-container.component.scss',
  templateUrl: './ref-config-edit-container.component.html'
})
export class RefConfigEditContainerComponent implements OnInit {
  // either an empty instance if creating new Ref or an 
  // already existing one if going from consultation view
  @Input() Ref!: Referential; 
  RefConfigForm: FormGroup = this.fb.group({});

  constructor(private rs: RefService, private fb: FormBuilder, 
    private router: Router, private route: ActivatedRoute,
    public cs: ColfigService, public es: EntryService, 
    public vs: ViewService) {}

  ngOnInit(): void {
    this.RefConfigForm = this.fb.group({
      name: this.fb.control(this.Ref.name),
      description: this.fb.control(this.Ref.description),
      columns: this.fb.array([])  // contains all the colfigs.
    });
    this.addColFormsFor(this.Ref);  // re-add col config fields
  }

  addColFormsFor(ref: Referential) {
    for(let colfig of ref.columns) {
      console.log(colfig.colType);
      const ColfigForm = this.fb.group({
        id: ['' || colfig.id], // this value is needed to be able to associate column config to ColId of referential under creation
        name: ['' || colfig.name.toUpperCase(), Validators.required],
        fileColName: ['' || colfig.fileColName ],
        dateFormat: ['' || colfig.dateFormat],
        required: [true && colfig.required],
        colType: [colfig.colType],
        pointedRefId: ['' || colfig.pointedRefId],
        pointedRefColId: ['' || colfig.pointedRefColId],
        pointedRefLabel: ['' || colfig.pointedRefLabel],
      });
      this.columns.push(ColfigForm);
    }
  }

  AddColToFormArray() {
    const ColfigForm = this.fb.group({
      ColId: [''], // this value is needed to be able to associate column config to ColId of referential under creation
      RefCol: ['', Validators.required],
      FileCol: '',
      DateFormat: '',
      Required: true,
      ColType: 'NONE',
      PointedRefId: '',
      PointedRefColId: '',
      LabelCol: '',
    });
    this.columns.push(ColfigForm);
  }

  UpdateReferential() {
    let refconfig: any = this.RefConfigForm.getRawValue();
    let ref = new Referential();
    
    if(this.Ref !== undefined)  // if we're not creating a referential from scratch
      ref.id = this.Ref.id;

    ref.name = refconfig['name']; // manually populate formcontrols for this to work
    ref.description = refconfig['description'];

    let createdColfigObservables: Observable<Colfig>[] = [];

    this.rs.putReferential(ref).subscribe((updatedRef) => {

      for(let colfig of refconfig['columns']) {
        colfig.ref_id = updatedRef.id;
        createdColfigObservables.push(this.cs.postColfig(colfig));  // TODO : make this a putColfig, it could be updating
      }
      
      const combinedObservable = forkJoin(createdColfigObservables);

      combinedObservable.subscribe({
        next: (responses: Colfig[]) => {
          // This callback is triggered when all post requests have been completed
          
          // POST all new entries from file
          for(let record of this.records) {  // TODO : do this only when we're creating a new referential, move to function
            const entry: Entry = new Entry();
            entry.ref_id = updatedRef.id;
            entry.fields = {};

            for(let colfig of responses) {
              entry.fields[colfig.id] = record[colfig.fileColName];  
            }
            this.es.postEntry(entry).subscribe((newEntry) => {
              console.log("Posted Entry :", newEntry);
            });
          }
          
          // POST default FULL_VIEW...
          this.rs.getReferentialBy(updatedRef.id).subscribe((theFuckingRef) => {
            let dispColIds = []
            
            for(let colfig of theFuckingRef.columns) {
              dispColIds.push(colfig.id);
            }
            
            let defaultView = new View();
            defaultView.ref_id = updatedRef.id;
            defaultView.name = "FULL_VIEW";
            
            defaultView.dispColIds = dispColIds;
            defaultView.searchColIds = dispColIds;
            this.vs.postView(defaultView).subscribe((view) => {
              console.log("Posted default view :", view);
            })
          })
        },
        error: (error) => {
          // Handle error if any of the post requests fail
          console.error('Error occurred:', error);
        }
      })
    })
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

  Debug() {
    console.log(JSON.stringify(this.RefConfigForm.getRawValue()));
  }

  file: File | undefined = undefined;
  
  upload(event: any) {
    
    let file: File = event.target.files[0];
    this.file = file;
    file.text().then(value => {
        
      let parsedCSV = Papa.parse(value, {header: true});
        // TODO : Deal with case where no header is provided
        
        let originalHeader: string[] = parsedCSV.meta.fields!;                  // these are the original column names
        for(let colName of originalHeader) {
          let colfig = new Colfig();
          colfig.fileColName = colName;
          colfig.name = colName.toUpperCase(); // TODO : deal with spaces, special characters etc
          colfig.colType = "NONE";
          colfig.required = true;
          this.Ref.columns.push(colfig);      // TODO : don't forget to add ref_id to every column (first post Ref, then get id from response)
        }

        this.Ref.name = this.file!.name;
        
        let records = parsedCSV.data as Record[];
        this.records = records;
        
        this.addColFormsFor(this.Ref);  // TODO : revamp to just adding for a single colfig, cycle before. 
    });
  }

  records: Record[] = [];

  getDispFileColNames() {
    let fileColNames = []
    for(let colfig of this.Ref.columns) {
      fileColNames.push(colfig.fileColName);
    }
    return fileColNames;
  }
}

