import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Referential } from '../../../../shared/models/referential.model';
import { RefViewState } from '../../../../shared/stores/ref-view/ref-view.state';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { SetInjectionViewMode } from '../../../../shared/stores/ref-view/ref-view.action';
import { SelectRefConfigToEdit } from '../../../../shared/stores/ref-config-edit/ref-config.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-container',
  templateUrl: './view-container.component.html',
  styleUrl: './view-container.component.scss'
})
export class ViewContainerComponent implements OnInit {
  constructor(public store: Store, public location: Location, public router: Router) {}
  
  @Select(RefViewState.getRef) ref$!: Observable<Referential>;  // TODO : check if dispatching action to change RefViewStateModel's ref re-emits a value
  @Select(RefViewState.isInjectionMode) isInjectionMode$!: Observable<boolean>;
  @Select(RefViewState.getSourceRef) srcRef$!: Observable<Referential>;

  ngOnInit(): void {
    //this.ref$.subscribe(value => console.log("ViewContainer reads :", value));

    let context = this.location.path().split('/')[1];
    if(context == 'view') {
      //console.log("SetInjectionViewModeToFalse");
      this.store.dispatch(new SetInjectionViewMode(false));
    }
  }

  consultationToEditView(refId: string) {
    this.router.navigate(['config', refId]);
  }
}
