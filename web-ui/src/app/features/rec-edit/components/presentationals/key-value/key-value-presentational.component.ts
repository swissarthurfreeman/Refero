import { Component, Input, OnInit } from '@angular/core';
import { Referential } from '../../../../../shared/models/referential.model';
import { Entry } from '../../../../../shared/models/record.model';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-key-value-presentational',
  templateUrl: './key-value-presentational.component.html',
  styleUrl: './key-value-presentational.component.scss'
})
export class KeyValuePresentationalComponent {
  ngOnInit(): void {}
  
  @Input() colName!: string;   
  @Input() FormControl!: FormControl; // contains colId and value
}
