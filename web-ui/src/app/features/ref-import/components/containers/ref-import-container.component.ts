import {Component, Input, OnInit} from '@angular/core';
import {Referential} from '../../../../shared/models/referential.model';
import {Entry, Record} from '../../../../shared/models/record.model';
import Papa from 'papaparse';
import {EntryService} from '../../../../shared/services/entry.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {RefService} from "../../../../shared/services/ref.service";
import {
  EntryFormGroup,
  KeyPairFormGroup
} from "../../../rec-edit/components/containers/rec-edit-container.component";
import {concat, firstValueFrom, Observable, Subject} from "rxjs";
import {Colfig} from "../../../../shared/models/Colfig.model";

@Component({
  selector: 'app-ref-import-container',
  templateUrl: './ref-import-container.component.html'
})
export class RefImportContainerComponent implements OnInit {
  constructor(private es: EntryService, private rs: RefService, private fb: FormBuilder) {
  }


  ngOnInit(): void {
    this.resetEntryForms()
  }

  @Input() Ref!: Referential;

  upload(event: any) {
    const file: File = event.target.files[0];

    file.text().then(value => {
      const parsedCSV = Papa.parse(value, {header: true});
      parsedCSV.data.pop(); // pop empty crap at end

      const rawRecords = parsedCSV.data as Record[];
      const fileHeader: Set<string> = new Set(parsedCSV.meta.fields!);

      if (this.validImportHeader(fileHeader)) {
        console.log("Valid header.");
        this.importEntries(rawRecords).then(() => {
          console.log("Successfully imported all entries.");
        });
      } else {
        console.log(
          `Invalid header, please provide a file respecting either : \n
           1. The file import column names, ${Array.from(this.getFileColNameHeaderOf(this.Ref)).toString()} \n
           2. A subset of the referential column names ${Array.from(this.getRefColNameHeaderOf(this.Ref)).toString()}
       `);
      }
    });
  }

  ImportWithFullFileColNameHeader: boolean = true;
  EntryErrorMap: Record = {};
  DestinationEntryForm!: FormGroup<EntryFormGroup>;
  IncomingEntryForm!: FormGroup<EntryFormGroup>;

  async importEntries(rawRecords: Record[]) {
    const entries: Entry[] = [];

    for (let record of rawRecords) {
      entries.push(this.getIncomingEntryFrom(record)); // {colId: value...}
    }

    this.getImportObservableOf(entries).subscribe({
      next: (value) => {
        console.log("Created entry :", value);
        this.resetEntryForms();
        this.EntryErrorMap = {};
      },
      error: async (httpError) => {
        console.log("Error :", httpError);
        this.EntryErrorMap = httpError.error.fields;

        const dupEntry: Entry = httpError.error.dupEntry;
        const incomingEntry: Entry = httpError.error.incomingEntry;

        this.createIncomingEntryForm(incomingEntry);
        this.createDestinationEntryForm(dupEntry);

        const response: any = await firstValueFrom(this.decision);
        if("update") {
          console.log("Update");
        }
      },
      complete: () => {}
    });
  }

  decision!: Subject<String>;

  /** Either drop incoming record or update existing with the provided fields of the incoming one. */
  emitChoice(choice: String) {
    this.decision.next(choice);
  }


  getImportObservableOf(entries: Entry[]): Observable<Entry> {
    let udpatedEntryObservables: Observable<Entry>[] = [];
    for(let entry of entries) {
      udpatedEntryObservables.push(this.es.postEntry(entry));
    }
    return concat(...udpatedEntryObservables);
  }

  resetEntryForms() {
    this.DestinationEntryForm = new FormGroup<EntryFormGroup>({
      keypairs: new FormArray<FormGroup<KeyPairFormGroup>>([])
    });

    this.IncomingEntryForm = new FormGroup<EntryFormGroup>({
      keypairs: new FormArray<FormGroup<KeyPairFormGroup>>([])
    });
  }

  /** Convert a raw record {fileColName|RefColName: value...} to {colId: value...} */
  getIncomingEntryFrom(rawRecord: Record): Entry {
    const entry =  new Entry();
    entry.refid = this.Ref.id;
    entry.fields = {};

    for(let colfig of this.Ref.columns) {
      if (this.ImportWithFullFileColNameHeader) {
        entry.fields[colfig.id] = rawRecord[colfig.filecolname];
      } else {
        entry.fields[colfig.id] = rawRecord[colfig.name];
      }
    }
    return entry;
  }

  createIncomingEntryForm(incomingEntry: Entry) {
    for (let colfig of this.Ref.columns) {
      const keyPairForm = new FormGroup<KeyPairFormGroup>({
        colId: new FormControl(colfig.id, {nonNullable: true}),
        value: new FormControl(incomingEntry.fields[colfig.id]),
      });
      this.IncomingEntryForm.controls.keypairs.push(keyPairForm);
    }
  }

  createDestinationEntryForm(destinationEntry: Entry) {
    for (let colfig of this.Ref.columns) {
      const keyPairFormGroup = new FormGroup<KeyPairFormGroup>({
        colId: new FormControl(colfig.id, {nonNullable: true}),
        value: new FormControl(destinationEntry.fields[colfig.id]),
      });
      this.DestinationEntryForm.controls.keypairs.push(keyPairFormGroup);
    }
  }

  /** Simple test of column import logic. */
  test() {
    const fileHeaders = [
      ["Code", "Nom_FR", "Nom_EN", "Desc_FR", "Desc_EN", "Statut"],
      ["CODE", "NOM", "DESC", "STATUT"],
      ["CODE", "STATUT"],
      ["Code", "Nom_FR", "Nom_IT", "Desc_FR", "Desc_IT", "Statut"],
      ["Code", "Nom_FR", "Desc_FR", "Statut"],
      ["CODE", "NOM", "Desc_FR", "STATUT"],
      ["CODE", "NOM", "DESC", "DESC_EN", "STATUT"],
      ["NOM", "DESC"]
    ]

    const refColNames = new Set(["CODE", "NOM", "DESC", "STATUT"]);
    const fileColNames = new Set(["Code", "Nom_FR", "Nom_EN", "Desc_FR", "Desc_EN", "Statut"]);

    for (let fileHeader of fileHeaders) {
      console.log(this.validFileColNameHeader(new Set(fileHeader), fileColNames) ||
        this.validRefColNameHeader(new Set(fileHeader), refColNames))
    }
  }

  /** Check import file header validity. Either header is exactly the set of file column names,
   * or the header is a subset of the refero referential column names. */
  validImportHeader(fileHeader: Set<string>): boolean {
    this.ImportWithFullFileColNameHeader =
      this.validFileColNameHeader(fileHeader, this.getFileColNameHeaderOf(this.Ref));
    return this.ImportWithFullFileColNameHeader
      || this.validRefColNameHeader(fileHeader, this.getRefColNameHeaderOf(this.Ref));
  }

  validFileColNameHeader(fileHeader: Set<string>, refFileColNameHeader: Set<string>) {
    return this.isEqualSets(fileHeader, refFileColNameHeader);
  }

  /** Check if header is subset of column names in referential. */
  validRefColNameHeader(fileHeader: Set<string>, refColNameHeader: Set<string>): boolean {
    return this.isSubsetOf(fileHeader, refColNameHeader);
  }

  /** Check if subset is a subset of b. */
  isSubsetOf(subset: Set<any>, b: Set<any>): boolean {
    for (let val of subset) {
      if (!b.has(val)) return false;
    }
    return true;
  }

  /** Return set of all non-blank referential column names. */
  getRefColNameHeaderOf(ref: Referential): Set<string> {
    const cols: Set<string> = new Set();
    for (let col of ref.columns) {
      if (col.name) {
        cols.add(col.name);
      }
    }
    return cols;
  }

  /** Return set of all non-blank referential import file column names */
  getFileColNameHeaderOf(ref: Referential): Set<string> {
    const cols: Set<string> = new Set();
    for (let col of ref.columns) {
      if (col.filecolname) {
        cols.add(col.filecolname);
      }
    }
    return cols;
  }

  isEqualSets(a: any, b: any) {
    if (a === b) return true;
    if (a.size !== b.size) return false;
    for (const value of a) if (!b.has(value)) return false;
    return true;
  }



  isEmpty(rec: Record) {
    return Object.keys(rec).length === 0;
  }

  /*
    decision!: Subject<String>;

      async importEntries(rawRecords: Record[]) {
        for (let rawEntry of rawRecords) {
          this.resetForms();
          const incomingEntry: Entry = new Entry();
          incomingEntry.refid = this.Ref.id;
          incomingEntry.fields = {};

          for (let colfig of this.Ref.columns) // TODO : deal with case when fileColName is empty (for example, column that only exists in Refero)
            incomingEntry.fields[colfig.id] = rawEntry[colfig.filecolname]; // re-use the import mapping

          while(true) {
            console.log("incomingEntry :", incomingEntry);
            const response: any = await firstValueFrom(this.es.putEntry(incomingEntry.id, incomingEntry)).catch((err) => { return err; });
            console.log("response :", response);    // response could be the created entry or an error

            if('error' in response) {               // handle error
              this.errorReport = JSON.parse(response.error.message);
              this.createIncomingEntryForm(incomingEntry);

              this.decision = new Subject<String>();

              if('dupEntry' in this.errorReport) {  // if it's a BK conflict, retrieve conflicting entry, else it's a required / FK conflict
                var dupEntry: Entry = JSON.parse(this.errorReport['dupEntry']);
                this.createDestinationEntryForm(dupEntry);

                const choice: String = await firstValueFrom(this.decision);
                if(choice === 'keepDest') {
                  console.log("We keep do not import the entry.");
                  break;
                }

                if(choice === 'takeIncoming') {
                  await this.updateIncomingForm(incomingEntry, dupEntry);    // modifies incomingEntry if user chooses keep incoming
                  continue;
                }
              } else {
                // deal with required field error or TODO invalid FK error
                console.log("No flow to deal with this.");
                const choice: String = await firstValueFrom(this.decision);
                if(choice === 'takeIncoming') {
                  await this.updateIncomingFormForRequiredFields(incomingEntry);
                  continue;
                }
              }
            }
            break;  // no error happened, return to next entry
          }
        }
        this.resetForms();
        console.log("Import done.");
      }

    async updateIncomingFormForRequiredFields(incomingEntry: Entry) {
      for (let mapFormControl of this.IncomingKeypairs.controls) {
        const keypair = mapFormControl.getRawValue();
        const colId = keypair['colId'];
        const value = keypair['value'];
        incomingEntry.fields[colId] = value;
      }
      return;
    }

    async updateIncomingForm(incomingEntry: Entry, dupEntry: Entry) {
      incomingEntry.id = dupEntry.id;
      for (let mapFormControl of this.IncomingKeypairs.controls) {
        const keypair = mapFormControl.getRawValue();
        const colId = keypair['colId'];
        const value = keypair['value'];
        incomingEntry.fields[colId] = value;
      }
      return;
    }

    resetForms() {
      this.IncomingEntryForm = this.fb.group({
        keypairs: this.fb.array([])
      });

      this.DestinationEntryForm = this.fb.group({
        keypairs: this.fb.array([])
      });

      this.errorReport = {};
    }

    emitChoice(choice: String) {
      this.decision.next(choice);
    }



    get IncomingKeypairs() {
      return this.IncomingEntryForm.controls["keypairs"] as FormArray;
    }

    createIncomingEntryForm(incomingEntry: Entry) {
      this.IncomingEntryForm = this.fb.group({
        keypairs: this.fb.array([])
      });

      for (let colfig of this.Ref.columns) {
        const mapForm = this.fb.group({
          colId: colfig.id,
          value: incomingEntry.fields[colfig.id],
        });
        mapForm.controls.colId.markAsTouched();
        mapForm.markAsTouched();
        this.IncomingKeypairs.push(mapForm);
      }
    }


    get DestinationKeyPairs() {
      return this.DestinationEntryForm.controls["keypairs"] as FormArray;
    }

    createDestinationEntryForm(destinationEntry: Entry) {
      this.DestinationEntryForm = this.fb.group({
        keypairs: this.fb.array([])
      });

      for (let colfig of this.Ref.columns) {
        const mapForm = this.fb.group({
          colId: colfig.id,
          value: destinationEntry.fields[colfig.id],
        });
        mapForm.controls.colId.markAsTouched();
        mapForm.markAsTouched();
        this.DestinationKeyPairs.push(mapForm);
      }
    }*/
}
