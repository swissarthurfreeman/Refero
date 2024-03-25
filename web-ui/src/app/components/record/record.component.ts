import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { ConsultationComponent } from "../consultation/consultation.component";
import { MatButtonModule } from '@angular/material/button';
import { Dictionary, Referential } from '../../model/referential.model';
import { RefDataService } from '../../service/ref-data.service';

interface keyable {
  [key: string]: any  
}

@Component({
    selector: 'app-record',
    standalone: true,
    templateUrl: './record.component.html',
    imports: [
      CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, 
      MatDividerModule, MatGridListModule, ConsultationComponent, MatButtonModule]
})
export class RecordComponent implements OnInit {
  constructor(public dataService: RefDataService) {}
  
  @Input() RefUid!: string;    // when viewing a record, ref and line ids are 
  DestinationRef!: Referential;
  
  @Input() RecUid!: string;  
  DestinationRecord!: Dictionary<string>;

  SourceRef!: Referential;
  SourceRefUid: string = '';       // Id of the referential from the which we inject a record to the current referential
  
  ngOnInit(): void {
    this.DestinationRef = this.dataService.getRefDataBy(this.RefUid);
    this.DestinationRecord = this.DestinationRef.getRecordById(this.RecUid);
  }

  SelectSourceRef(refUid: string) {
    this.SourceRef = this.dataService.getRefDataBy(refUid);
  }
}
