import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Referential} from '../../../../../shared/models/referential.model';
import {RefService} from '../../../../../shared/services/ref.service';
import {Observable} from 'rxjs';
import {Record} from "../../../../../shared/models/record.model";
import {Colfig} from "../../../../../shared/models/Colfig.model";
import {ColfigConfigForm} from "../../containers/ref-config-edit-container.component";

@Component({
  selector: 'app-col-config-presentational',
  templateUrl: './col-config-presentational.component.html'
})
export class ColConfigPresentationalComponent implements OnInit {
  constructor(public rs: RefService) {
  }

  @Input() ColfigErrorMap: Record = {};
  @Input() Ref!: Referential;
  @Input() colfigConfigForm!:  FormGroup<ColfigConfigForm>;

  ngOnInit(): void {
    this.refs$ = this.rs.getReferentials();
  }

  refs$!: Observable<Referential[]>;
  pointedRef$!: Observable<Referential>;

  SelectPointedRef(refid: string) {
    this.pointedRef$ = this.rs.getReferentialBy(refid);
  }

  hasComposedBk(PointedRef: Referential): boolean {
    let Bks: Colfig[] = [];
    for(let colfig of PointedRef.columns) {
      if(colfig.coltype === "BK") {
        Bks.push(colfig);
      }
    }
    return Bks.length > 1;
  }

  ClearFkConfig() {
    console.log("Clear fields");
    this.colfigConfigForm.controls.pointedrefid.setValue('');
    this.colfigConfigForm.controls.pointedrefcolid.setValue('');
    this.colfigConfigForm.controls.pointedrefcollabelid.setValue('');
  }
}
