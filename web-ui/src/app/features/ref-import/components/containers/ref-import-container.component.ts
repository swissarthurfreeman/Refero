import { Component, Input } from '@angular/core';
import { Referential } from '../../../../shared/models/referential.model';
import { Entry, Record } from '../../../../shared/models/record.model';
import Papa from 'papaparse';
import { EntryService } from '../../../../shared/services/entry.service';
import { Observable, Subject, catchError, firstValueFrom } from 'rxjs';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ref-import-container',
  templateUrl: './ref-import-container.component.html'
})
export class RefImportContainerComponent {
  constructor(private es: EntryService, private fb: FormBuilder) { }

  @Input() Ref!: Referential;

  upload(event: any) {
    let file: File = event.target.files[0];

    file.text().then(value => {
      let parsedCSV = Papa.parse(value, { header: true });
      parsedCSV.data.pop(); // pop empty crap at end

      console.log(parsedCSV.data);
      let rawRecords = parsedCSV.data as Record[];
      this.importEntries(rawRecords);
    });
  }
  
  errorReport: Record = {};

  isEmpty(rec: Record) {
    return Object.keys(rec).length === 0;
  }

  decision!: Subject<String>;


  async importEntries(rawRecords: Record[]) {
    for (let rawEntry of rawRecords) {
      const incomingEntry: Entry = new Entry();
      incomingEntry.ref_id = this.Ref.id;
      incomingEntry.fields = {};

      for (let colfig of this.Ref.columns) {
        // TODO : deal with case when fileColName is empty (for example, column that only exists in Refero)
        incomingEntry.fields[colfig.id] = rawEntry[colfig.fileColName]; // re-use the import mapping 
      }

      var validationPassed = false;
      do {
        const obs: Observable<any> = this.es.putEntry(incomingEntry);    // could be the created entry or an error
        const response: any = await firstValueFrom(obs).catch((err) => {
          return err;
        });
        console.log("Reponse =", response);

        if('error' in response) { // handle error
          this.errorReport = JSON.parse(response.error.message); 
          //this.erroredEntry = incomingEntry;

          this.createIncomingEntryForm(incomingEntry);

          console.log("dupEntry =", this.errorReport['dupEntry'])

          if('dupEntry' in this.errorReport) {   // if it's a BK conflict, retrieve conflicting entry
            console.log("Creating destination form");
            this.createDestinationEntryForm(JSON.parse(this.errorReport['dupEntry']))
          }

          console.group("errorReport =", this.errorReport);

          this.decision = new Subject<String>();
          const choice: String = await firstValueFrom(this.decision);

          if(choice === 'keepDest') {
            console.log("We keep destination, do not import line.")
          }

          if(choice === 'takeIncoming') {

            // TODO : read values from the incoming formArray and update incomingEntry based on that
            // this needs to be done to deal with required key errors

            console.log("We overwite the record, e.g. POST with the entry ID assigned to the (updates Entry with that ID)");
            incomingEntry.id = JSON.parse(this.errorReport['dupEntry']).id;
            console.log("incomingEntry", incomingEntry);
          }
          console.log("User chose :", choice);
        } else {
          validationPassed = true;  // if no error, move to next entry
        }
      } while(!validationPassed);

      console.log("Reset Forms")
      this.IncomingEntryForm = this.fb.group({
        keypairs: this.fb.array([])
      });

      this.IncomingEntryForm = this.fb.group({
        keypairs: this.fb.array([])
      }); 

      this.errorReport = {};
    }
  }

  emitChoice(choice: String) {
    this.decision.next(choice);
  }

  IncomingEntryForm!: FormGroup;


  get IncomingKeypairs() {
    return this.IncomingEntryForm.controls["keypairs"] as FormArray;
  }

  createIncomingEntryForm(incomingEntry: Entry) {
    this.IncomingEntryForm = this.fb.group({
      keypairs: this.fb.array([])
    });

    for(let colfig of this.Ref.columns) {
      const mapForm = this.fb.group({
        colId: colfig.id,
        value: incomingEntry.fields[colfig.id],
      });
      mapForm.controls.colId.markAsTouched();
      mapForm.markAsTouched();
      this.IncomingKeypairs.push(mapForm);
    }
  }

  DestinationEntryForm!: FormGroup;

  get DestinationKeyPairs() {
    return this.DestinationEntryForm.controls["keypairs"] as FormArray;
  }

  createDestinationEntryForm(destinationEntry: Entry) {
    this.DestinationEntryForm = this.fb.group({
      keypairs: this.fb.array([])
    });

    for(let colfig of this.Ref.columns) {
      const mapForm = this.fb.group({
        colId: colfig.id,
        value: destinationEntry.fields[colfig.id],
      });
      mapForm.controls.colId.markAsTouched();
      mapForm.markAsTouched();
      this.DestinationKeyPairs.push(mapForm);
    }
  }
}
