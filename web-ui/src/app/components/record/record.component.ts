import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { ConsultationComponent } from "../consultation/consultation.component";
import { MatButtonModule } from '@angular/material/button';

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
  ngOnInit(): void {}

  @Input() RefUid!: string;    // when viewing a record, ref and line ids are 
  @Input() recId!: string;    
  sourceRef: string = '';
  record: Object = {
      'REE_N_OFS': 71725922,
      'C_ALPHA_NEW': 'UNIGE',
      'REE_RUE': 'Boulevard du Pont-d’Arve',
      'REE_N_RUE': 40
  };      // mock record value (to be queried via service)
  keys: Array<string> = Object.keys(this.record);
  vals: Array<string> = Object.values(this.record);
}
