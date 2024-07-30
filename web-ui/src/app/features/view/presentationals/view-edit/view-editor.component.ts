import { ApplicationRef, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ViewService } from '../../../../shared/services/view.service';
import { RefService } from '../../../../shared/services/ref.service';
import { Referential } from '../../../../shared/models/referential.model';
import { View } from '../../../../shared/models/view.model';
import { ColfigService } from '../../../../shared/services/colfig.service';
import { SetCurrentView } from '../../../../shared/stores/ref-view/ref-view.action';
import { Router } from '@angular/router';
import { SetInjectionSourceRefView } from '../../../../shared/stores/rec-edit/rec-edit.action';


@Component({
  selector: 'app-view-editor',
  templateUrl: './view-editor.component.html'
})
export class ViewEditorComponent implements OnInit {
  constructor(
    public rs: RefService,
    public vs: ViewService,
    public cs: ColfigService,
    private store: Store,
    private appRef: ApplicationRef,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.savedView = JSON.parse(JSON.stringify(this.View));
    this.newViewId = new FormControl('AWESOME_VIEW');
    this.cd.detectChanges();
  }

  savedView!: View;

  @Input() isInjectionMode: boolean = false;
  @Input() Ref!: Referential; // TODO : get rid of non url inputs, use @Select instead.
  @Input() View!: View;

  newViewId = new FormControl('AWESOME_VIEW');

  saveCurrentView(view: View) {
    let newView: View = JSON.parse(JSON.stringify(view));
    newView.id = '';
    newView.name = this.newViewId.getRawValue()!;

    this.vs.postView(newView).subscribe(() => {
      this.store.dispatch(new SetCurrentView(this.savedView));
      this.reloadCurrentRoute();
    });
  }

  reloadCurrentRoute() {
    let currUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currUrl]);
    })
  }

  searchColIdToAdd!: string;

  addSearchCol() {
    if(!this.View.searchcolids.includes(this.searchColIdToAdd))
      this.View.searchcolids.push(this.searchColIdToAdd);
  }

  dispColIdToAdd!: string;

  addDispCol() {
    if(!this.View.dispcolids.includes(this.dispColIdToAdd))
      this.View.dispcolids.push(this.dispColIdToAdd);
  }


  SelectView(viewId: string) {                          // TODO : avoid http request, select from ref instead
    this.vs.getView(viewId).subscribe((view) => {        // retrieve previous value of view (unmodified)
      this.savedView = JSON.parse(JSON.stringify(view));

      if(this.isInjectionMode)
        this.store.dispatch(new SetInjectionSourceRefView(view));
      else
        this.store.dispatch(new SetCurrentView(view));
    });
  }
}


