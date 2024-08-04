import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { RefService } from '../../../shared/services/ref.service';
import { SetCurrentRef, SetCurrentView } from '../../../shared/stores/ref-view/ref-view.action';
import { ViewService } from '../../../shared/services/view.service';
import { Referential } from '../../../shared/models/referential.model';
import { Observable } from 'rxjs';
import { RefViewState } from '../../../shared/stores/ref-view/ref-view.state';

@Component({
  selector: 'app-view',
  templateUrl: './view-routable.component.html'
})
export class ViewRoutableComponent implements OnInit {

  constructor(
    private ds: RefService, public vs: ViewService,
    public store: Store, public router: Router) {}


  @Input() refid!: string;

  ngOnInit(): void {
    console.log("Ref-View Routable");
    this.ds.getReferentialBy(this.refid).subscribe((ref) => {
      this.store.dispatch([
        new SetCurrentRef(ref),
        new SetCurrentView(ref.views[0])
      ]);
    });
  }
}
