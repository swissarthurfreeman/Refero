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
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {
  
  constructor(
    private ds: RefService, public vs: ViewService,  
    public store: Store, public router: Router) {}


  @Input() refid!: string;

  ngOnInit(): void {
    this.ds.getReferentialBy(this.refid).subscribe((ref) => {
      this.store.dispatch([
        new SetCurrentRef(ref),
        new SetCurrentView(ref.views[0])
      ]);
    });
  }
}
