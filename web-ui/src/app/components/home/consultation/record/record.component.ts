import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

interface keyable {
  [key: string]: any  
}

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record.component.html'
})
export class RecordComponent implements OnInit {
  ngOnInit(): void {}

  @Input() refId!: string;    // when viewing a record, ref and line ids are 
  @Input() recId!: string;

  record: Object = {
      'REE_N_OFS': 71725922,
      'C_ALPHA_NEW': 'UNIGE',
      'REE_RUE': 'Boulevard du Pont-d’Arve',
      'REE_N_RUE': 40
  };      // mock record value (to be queried via service)
  keys: Array<string> = Object.keys(this.record);
  vals: Array<string> = Object.values(this.record);
}
