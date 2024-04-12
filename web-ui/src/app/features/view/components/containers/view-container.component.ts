import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Referential } from '../../../../shared/models/referential.model';
import { RefViewState } from '../../../../shared/stores/ref-view/ref-view.state';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { SetInjectionMode } from '../../../../shared/stores/ref-view/ref-view.action';
import { Router } from '@angular/router';
import { View } from '../../../../shared/models/view.model';

@Component({
  selector: 'app-view-container',
  templateUrl: './view-container.component.html',
  styleUrl: './view-container.component.scss'
})
export class ViewContainerComponent implements OnInit {
  constructor(public store: Store, public location: Location, public router: Router) {}
  
  @Select(RefViewState.getCurrentRef) currRef$!: Observable<Referential>;  // TODO : check if dispatching action to change RefViewStateModel's ref re-emits a value
  @Select(RefViewState.isInjectionMode) injectionMode$!: Observable<boolean>;
  @Select(RefViewState.getCurrentView) currView$!: Observable<View>;
  
  ngOnInit(): void {
    let context = this.location.path().split('/')[1];
    if(context == 'view') {
      this.store.dispatch(new SetInjectionMode(false));
    }
  }

  consultationToEditView(refId: string) {
    this.router.navigate(['config', refId]);
  }
}
