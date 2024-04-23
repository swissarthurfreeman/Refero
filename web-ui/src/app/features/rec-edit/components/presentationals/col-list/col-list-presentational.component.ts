import { Component, Input, OnInit } from '@angular/core';
import { Referential } from '../../../../../shared/models/referential.model';
import { Entry } from '../../../../../shared/models/record.model';

@Component({
  selector: 'app-col-list-presentational',
  templateUrl: './col-list-presentational.component.html',
  styleUrl: './col-list-presentational.component.scss'
})
export class ColListPresentationalComponent {
  ngOnInit(): void {
  }
  @Input() DestRef!: Referential;   // why do we need the DestRef ? Can't we just modify DestRec by reference ? 
  @Input() DestRec!: Entry;
}
