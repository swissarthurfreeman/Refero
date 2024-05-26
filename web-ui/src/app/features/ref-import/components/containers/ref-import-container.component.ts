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
      this.resetForms();
      const incomingEntry: Entry = new Entry();
      incomingEntry.ref_id = this.Ref.id;
      incomingEntry.fields = {};

      for (let colfig of this.Ref.columns) // TODO : deal with case when fileColName is empty (for example, column that only exists in Refero)
        incomingEntry.fields[colfig.id] = rawEntry[colfig.fileColName]; // re-use the import mapping 
      
      while(true) {
        console.log("incomingEntry :", incomingEntry);
        const response: any = await firstValueFrom(this.es.putEntry(incomingEntry)).catch((err) => { return err; });
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
            // deal with required field error or invalid FK error
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
    for(let mapFormControl of this.IncomingKeypairs.controls) {
      const keypair = mapFormControl.getRawValue();
      const colId = keypair['colId'];
      const value = keypair['value'];
      incomingEntry.fields[colId] = value;
    }
    return;
  }

  async updateIncomingForm(incomingEntry: Entry, dupEntry: Entry) {
    incomingEntry.id = dupEntry.id;
    for(let mapFormControl of this.IncomingKeypairs.controls) {
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
