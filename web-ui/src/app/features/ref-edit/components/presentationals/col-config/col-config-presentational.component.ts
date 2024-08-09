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

    if(this.colfigConfigForm.controls.pointedrefid.getRawValue()) {
      this.SelectPointedRef(this.colfigConfigForm.controls.pointedrefid.getRawValue()!);
    }
  }

  refs$!: Observable<Referential[]>;
  pointedRef$!: Observable<Referential>;

  SelectPointedRef(refid: string) {
    this.pointedRef$ = this.rs.getReferentialBy(refid);
    if(this.colfigConfigForm.controls.pointedrefcollabelids.controls.length == 0) {
      this.AddFkLabelToFkColfigConfig(this.Ref.columns[0].id);
    }
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
    this.colfigConfigForm.controls.pointedrefcollabelids.setValue([]);
  }

  Debug() {
    console.log(this.colfigConfigForm.getRawValue());
  }

  AddFkLabelToFkColfigConfig(colId: string) {
    console.log("Add :", colId);
    this.colfigConfigForm.controls.pointedrefcollabelids.controls.push(
      new FormControl(colId, {nonNullable: true})
    )
  }

  deleteFkLabelAt(idx: number) {
    this.colfigConfigForm.controls.pointedrefcollabelids.removeAt(idx);
  }
}
