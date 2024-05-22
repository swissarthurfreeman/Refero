import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Referential } from '../../../../../shared/models/referential.model';
import { RefService } from '../../../../../shared/services/ref.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-col-config-presentational',
  templateUrl: './col-config-presentational.component.html'
})
export class ColConfigPresentationalComponent implements OnInit {
  constructor(public rs: RefService) {}
  
  ngOnInit(): void {
    this.refs$ = this.rs.getReferentials();
    this.pointedRef$ = this.rs.getReferentialBy(this.FormControl.getRawValue()['pointedRefId']); // we get formControl from parent with colfig
  }

  refs$!: Observable<Referential[]>; 
  pointedRef$!: Observable<Referential>; 

  SelectPointedRef(refId: string) {
    console.log("Select", refId);
    this.pointedRef$ = this.rs.getReferentialBy(refId);
  }


  @Input() Ref!: Referential;
  @Input() FormControl!: FormControl;

  DebugCol() {
    console.log(this.FormControl.getRawValue());
  }
}
