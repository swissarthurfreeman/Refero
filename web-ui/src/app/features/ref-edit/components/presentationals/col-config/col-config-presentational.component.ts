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

  }

  SelectColType(ColType: any) {
    if(ColType == "FK") {
      this.refs$ = this.rs.getReferentials();
    }
  }

  refs$!: Observable<Referential[]>; 
  pointedRef$!: Observable<Referential>; 

  SelectPointedRefId(refId: any) {
    this.pointedRef$ = this.rs.getReferentialBy(refId);
  }

  @Input() Ref!: Referential;
  @Input() FormControl!: FormControl;

  DebugCol() {
    console.log(this.FormControl.getRawValue());
  }
}
