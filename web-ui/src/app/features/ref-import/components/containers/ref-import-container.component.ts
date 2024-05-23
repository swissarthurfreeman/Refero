import { Component, Input } from '@angular/core';
import { Referential } from '../../../../shared/models/referential.model';
import { Entry, Record } from '../../../../shared/models/record.model';
import Papa from 'papaparse';
import { EntryService } from '../../../../shared/services/entry.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-ref-import-container',
  templateUrl: './ref-import-container.component.html'
})
export class RefImportContainerComponent {
  constructor(private es: EntryService) { }

  @Input() Ref!: Referential;

  upload(event: any) {
    let file: File = event.target.files[0];

    file.text().then(value => {
      let parsedCSV = Papa.parse(value, { header: true });
      parsedCSV.data.pop(); // pop empty crap at end

      console.log(parsedCSV.data);
      let rawRecords = parsedCSV.data as Record[];
      this.updateEntries(rawRecords);
    });
  }


  updateEntries(rawRecords: Record[]) {
    for (let record of rawRecords) {
      const entry: Entry = new Entry();
      entry.ref_id = this.Ref.id;
      entry.fields = {};

      for (let colfig of this.Ref.columns) {
        // TODO : deal with case when fileColName is empty (for example, column that only exists in Refero)
        entry.fields[colfig.id] = record[colfig.fileColName]; // re-use the import mapping 
      }
      this.es.postEntry(entry).subscribe((newEntry) => {
        console.log("Posted Entry :", newEntry);
      });
    }
  }
}
