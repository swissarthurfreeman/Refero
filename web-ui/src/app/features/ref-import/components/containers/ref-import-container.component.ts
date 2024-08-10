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
import {firstValueFrom, Observable, Subject} from "rxjs";
import {v4 as uuid} from 'uuid';
import {EntryPutErrorTypeEnum} from "../../../../shared/enums/entryputerrortype.enum";
import {HttpClient, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-ref-import-container',
  templateUrl: './ref-import-container.component.html'
})
export class RefImportContainerComponent implements OnInit {
  constructor(private es: EntryService, private rs: RefService, private fb: FormBuilder, private http: HttpClient) {
  }


  ngOnInit(): void {
    this.resetEntryForms()
  }

  @Input() Ref!: Referential;

  done: boolean = false;

  upload(event: any) {
    const file: File = event.target.files[0];

    file.text().then(value => {
      const parsedCSV = Papa.parse(value, {header: true});
      parsedCSV.data.pop(); // pop empty crap at end

      const rawRecords = parsedCSV.data as Record[];
      const fileHeader: Set<string> = new Set(parsedCSV.meta.fields!);

      if (this.validImportHeader(fileHeader)) {
        this.done = false;
        this.importEntries(rawRecords).then(() => {
          this.resetEntryForms();
          this.EntryErrorMap = {};
          this.done = true;
          console.log(
            "n_updated :", this.n_updated, "n_inserted", this.n_inserted,
            "n_discarded_duplicate_bk :", this.n_discarded_duplicate_bk,
            "n_discarded_invalid_dateformat :", this.n_discarded_invalid_dateformat,
            "n_discarded_missing_req_value", this.n_discarded_missing_req_value,
            "n_discarded_invalid_fk_value", this.n_discarded_invalid_fk_value,
            "n_discarded :", this.n_discarded
          );
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
  errType!: EntryPutErrorTypeEnum;

  n_inserted: number = 0;
  n_updated: number = 0;
  n_discarded: number = 0;
  n_discarded_missing_req_value: number = 0;
  n_discarded_invalid_dateformat: number = 0;
  n_discarded_invalid_fk_value: number = 0;
  n_discarded_duplicate_bk: number = 0;
  n_tries: number = 0;    // track the number of times we've tried to update/create the entry being imported

  async importEntries(rawRecords: Record[]) {
    const entries: Entry[] = [];

    for (let record of rawRecords) {
      entries.push(this.getIncomingEntryFrom(record)); // {colId: value...}
    }

    for (let putObservable of this.getImportObservableOf(entries)) {
      this.resetEntryForms();
      this.EntryErrorMap = {};
      let response: any = await this.noThrowPut(putObservable);
      if (response.error) {
        const errType: EntryPutErrorTypeEnum = response.error.errType as EntryPutErrorTypeEnum;

        if (errType == EntryPutErrorTypeEnum.DuplicateBk && this.UpdateExisingEntriesBasedOnBk) {
          const dupEntry: Entry = response.error.dupEntry;
          this.patchIncomingEntryTo(response.error.incomingEntry, dupEntry);
          response = await this.noThrowPut(this.http.put<Entry>(`api/entries/${dupEntry.id}`, dupEntry, {observe: "response"}));
        }

        while (response.error) {
          this.resetEntryForms();
          this.EntryErrorMap = {};
          const errType: EntryPutErrorTypeEnum = response.error.errType as EntryPutErrorTypeEnum;

          if (this.CheckIfUserImportConfigDropsEntry(errType)) {
            break;
          }

          const incomingEntry: Entry = response.error.incomingEntry;
          this.createIncomingEntryForm(incomingEntry);
          this.EntryErrorMap = response.error.fields;


          if (errType == EntryPutErrorTypeEnum.DuplicateBk) {
            this.createDestinationEntryForm(response.error.dupEntry);
          }

          this.decision = new Subject<String>();
          let choice = await firstValueFrom(this.decision);

          if (choice == 'takeIncoming') {
            if (errType == EntryPutErrorTypeEnum.DuplicateBk) {
              const dupEntry: Entry = response.error.dupEntry;
              this.patchIncomingEntryFormTo(dupEntry);
              response = await this.noThrowPut(this.http.put<Entry>(`api/entries/${dupEntry.id}`, dupEntry, {observe: "response"}));
            } else {
              this.patchIncomingEntryFormTo(incomingEntry);
              response = await this.noThrowPut(this.http.put<Entry>(`api/entries/${incomingEntry.id}`, incomingEntry, {observe: "response"}));
            }
          } else {
            this.n_discarded++;
          }
        }
      }
      if (response.status == 201) {
        this.n_inserted++;
      } else if (response.status == 200) {
        this.n_updated++;
      }
    }
  }

  CheckIfUserImportConfigDropsEntry(errType: EntryPutErrorTypeEnum) {
    if (errType === EntryPutErrorTypeEnum.DuplicateBk && this.DropEntriesWithDuplicateBKs) {
      this.n_discarded_duplicate_bk++;
      this.n_discarded++;
      return true;
    } else if (errType === EntryPutErrorTypeEnum.RequiredColumnMissing && this.DropEntriesWithMissingRequiredColumns) {
      this.n_discarded_missing_req_value++;
      this.n_discarded++;
      return true;
    } else if (errType === EntryPutErrorTypeEnum.InvalidFk && this.DropEntriesWithInvalidFks) {
      this.n_discarded_invalid_fk_value++;
      this.n_discarded++;
      return true;
    } else if (errType === EntryPutErrorTypeEnum.InvalidDateFormat && this.DropEntriesWithInvalidDateFormats) {
      this.n_discarded_invalid_dateformat++;
      this.n_discarded++;
      return true;
    }
    return false;
  }

  // true means dup BK error then, dup entry is patched with incoming entry and updated.
  // if false, it means the user will have to decide what to do. (incoming / dupEntry forms)
  UpdateExisingEntriesBasedOnBk: boolean = true;

  CheckUpdateExisingEntriesBasedOnBk(choice: boolean) {
    this.UpdateExisingEntriesBasedOnBk = choice;
  }

  DropEntriesWithInvalidDateFormats: boolean = false;

  CheckDropEntriesWithInvalidDateFormats(choice: boolean) {
    this.DropEntriesWithInvalidDateFormats = choice;
  }

  DropEntriesWithInvalidFks: boolean = false;

  CheckDropEntriesWithInvalidFks(choice: boolean) {
    this.DropEntriesWithInvalidFks = choice;
  }

  DropEntriesWithMissingRequiredColumns: boolean = false;

  CheckDropEntriesWithMissingRequiredColumns(choice: boolean) {
    this.DropEntriesWithMissingRequiredColumns = choice;
  }

  // true means, if a BK error happens, then the incoming entry is abandoned.
  DropEntriesWithDuplicateBKs: boolean = false;

  CheckDropEntriesWithDuplicateBKs(choice: boolean) {
    this.DropEntriesWithDuplicateBKs = choice;
  }

  async noThrowPut(eObs: Observable<HttpResponse<Entry>>) {
    try {
      let response: any = await firstValueFrom(eObs);
      return response;
    } catch (err) {
      return err;
    }
  }

  /** Patch non empty values of incomingEntry to */
  patchIncomingEntryTo(incomingEntry: Entry, to: Entry) {
    for(let colId of Object.keys(incomingEntry.fields)) {
      if(incomingEntry.fields[colId]) {
        to.fields[colId] = incomingEntry.fields[colId];
      }
    }
  }

  /** Take all non blank (colId, value) keypairs from the IncomingEntryForm and patch them to */
  patchIncomingEntryFormTo(to: Entry): void {
    for (let keypair of this.IncomingEntryForm.controls.keypairs.controls) {
      if (keypair.controls.value.getRawValue()) {
        to.fields[keypair.controls.colId.getRawValue()] = keypair.controls.value.getRawValue()!;
      }
    }
  }

  decision!: Subject<String>;

  /** Either drop incoming record or update existing with the provided fields of the incoming one. */
  emitChoice(choice: String) {
    console.log("Emit");
    this.decision.next(choice);
  }


  getImportObservableOf(entries: Entry[]): Observable<HttpResponse<Entry>>[] {
    let udpatedEntryObservables: Observable<HttpResponse<Entry>>[] = [];
    for (let entry of entries) {
      udpatedEntryObservables.push(this.http.put<Entry>(`api/entries/${uuid().toString()}`, entry, {observe: "response"}));
    }
    return udpatedEntryObservables;
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
    const entry = new Entry();
    entry.refid = this.Ref.id;
    entry.fields = {};

    for (let colfig of this.Ref.columns) {
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
      if (colfig.name != "") {
        const keyPairForm = new FormGroup<KeyPairFormGroup>({
          colId: new FormControl(colfig.id, {nonNullable: true}),
          value: new FormControl(incomingEntry.fields[colfig.id]),
        });
        this.IncomingEntryForm.controls.keypairs.push(keyPairForm);
      }
    }
  }

  createDestinationEntryForm(destinationEntry: Entry) {
    for (let colfig of this.Ref.columns) {
      if (colfig.name != "") {
        const keyPairFormGroup = new FormGroup<KeyPairFormGroup>({
          colId: new FormControl(colfig.id, {nonNullable: true}),
          value: new FormControl(destinationEntry.fields[colfig.id]),
        });
        this.DestinationEntryForm.controls.keypairs.push(keyPairFormGroup);
      }
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

  protected readonly EntryPutErrorTypeEnum = EntryPutErrorTypeEnum;
}
