import { Component, Input, OnInit } from '@angular/core';
import { Dictionary, Referential } from '../../../../../shared/models/referential.model';

@Component({
  selector: 'app-col-list-presentational',
  templateUrl: './col-list-presentational.component.html',
  styleUrl: './col-list-presentational.component.scss'
})
export class ColListPresentationalComponent {
  ngOnInit(): void {
    //console.log("ColListPresentational reads :", this.DestRef, this.DestRec);
  }
  @Input() DestRef!: Referential;   // why do we need the DestRef ? Can't we just modify DestRec by reference ? 
  @Input() DestRec!: Dictionary<string>;
}
