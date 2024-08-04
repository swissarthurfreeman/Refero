import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {RefViewState} from '../../../shared/stores/ref-view/ref-view.state';
import {Referential} from '../../../shared/models/referential.model';
import {View} from '../../../shared/models/view.model';
import {TableComponent} from '../presentationals/table/table.component';
import {RefService} from '../../../shared/services/ref.service';
import {SetInjectionMode} from "../../../shared/stores/rec-edit/rec-edit.action";

@Component({
  selector: 'app-view-container',
  templateUrl: './view-container.component.html',
  styleUrl: './view-container.component.scss'
})
export class ViewContainerComponent implements OnInit {
  constructor(public rs: RefService, public store: Store, public location: Location, public router: Router, private cd: ChangeDetectorRef) {
  }

  @Select(RefViewState.getCurrentRef) currRef$!: Observable<Referential>;
  @Select(RefViewState.isInjectionMode) injectionMode$!: Observable<boolean>;
  @Select(RefViewState.getCurrentView) currView$!: Observable<View>;

  ngOnInit(): void {
    let context = this.location.path().split('/')[1];   // TODO : see if this code is needed
    if (context == 'view') {
      this.store.dispatch(new SetInjectionMode(false));
    }
    // Angular change detection only checks object identity, not object content, the observable may emit new values
    // but the actual reference won't change.
    this.cd.detectChanges();
  }

  consultationToEditView(refid: string) {
    this.router.navigate(['config', refid]);
  }

  consultationToNewRecord(refid: string) {
    this.router.navigate(['entry', refid, 'new']);
  }

  importFile(refid: string) {
    this.router.navigate(['import', refid]);
  }

  // retrieve reference to child table component via @ViewChild to be able to export.
  @ViewChild(TableComponent) table!: TableComponent;

  exportReferential() {
    this.table.exportTable();
  }

  DeleteRef(ref: Referential) {
    if (confirm(
      `Êtes vous sur de vouloir supprimer le référentiel suivant ? \n ${ref.name}
      \nCette action supprimera toutes les lignes et colonnes du référentiel et est irréversible !  Veuillez faire les sauvegardes appropriées.`)) {
      this.rs.delReferential(ref.id).subscribe(() => {
        this.location.back();
      })
    }
  }
}
