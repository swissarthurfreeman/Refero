import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RefViewState } from '../../../shared/stores/ref-view/ref-view.state';
import { Referential } from '../../../shared/models/referential.model';
import { SetInjectionMode } from '../../../shared/stores/ref-view/ref-view.action';
import { View } from '../../../shared/models/view.model';
import { TableComponent } from '../presentationals/table/table.component';

@Component({
  selector: 'app-view-container',
  templateUrl: './view-container.component.html',
  styleUrl: './view-container.component.scss'
})
export class ViewContainerComponent implements OnInit {
  constructor(public store: Store, public location: Location, public router: Router, private cd: ChangeDetectorRef) {}
  
  @Select(RefViewState.getCurrentRef) currRef$!: Observable<Referential>;  // TODO : check if dispatching action to change RefViewStateModel's ref re-emits a value
  @Select(RefViewState.isInjectionMode) injectionMode$!: Observable<boolean>;
  @Select(RefViewState.getCurrentView) currView$!: Observable<View>;
  
  ngOnInit(): void {
    let context = this.location.path().split('/')[1];
    if(context == 'view') {
      this.store.dispatch(new SetInjectionMode(false));
    }
    // Angular change detection only checks object identity, not object content, the observable may emit new values
    // but the actual reference won't change. 
    this.cd.detectChanges();  
  }

  consultationToEditView(refId: string) {
    this.router.navigate(['config', refId]);
  }

  consultationToNewRecord(refId: string) {
    this.router.navigate(['entry', refId, '']);
  }

  importFile(refId: string) {
    this.router.navigate(['import', refId]);
  }

  @ViewChild(TableComponent) table!: TableComponent;

  exportReferential() {
    this.table.exportTable();
  }
}
