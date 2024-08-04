import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Store} from '@ngxs/store';
import {ViewService} from '../../../../shared/services/view.service';
import {RefService} from '../../../../shared/services/ref.service';
import {Referential} from '../../../../shared/models/referential.model';
import {View} from '../../../../shared/models/view.model';
import {ColfigService} from '../../../../shared/services/colfig.service';
import {SetCurrentView} from '../../../../shared/stores/ref-view/ref-view.action';
import {Router} from '@angular/router';
import {SetInjectionSourceRefView} from '../../../../shared/stores/rec-edit/rec-edit.action';
import {v4 as uuid} from 'uuid';

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
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log("View Editor Changes :", changes);
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.newViewName = new FormControl('AWESOME_VIEW');
    this.cd.detectChanges();
  }

  @Input() isInjectionMode: boolean = false;
  @Input() Ref!: Referential; // TODO : get rid of non url inputs, use @Select instead.
  @Input() View!: View;

  newViewName = new FormControl('AWESOME_VIEW');

  saveCurrentView(view: View) {
    // get a copy of the current (soon to be persisted new view)
    const newView: View = JSON.parse(JSON.stringify(view));
    newView.name = this.newViewName.getRawValue()!;
    // if it's a new view, assign a new id to it.
    if (newView.name != view.name) {
      newView.id = uuid().toString();
    }

    this.vs.putView(newView.id, newView).subscribe(() => {
      this.reloadCurrentRoute(newView);
    });
  }

  deleteView(viewId: string) {

    if(confirm(`Êtes-vous sûr de vouloir supprimer la vue ${this.View.name} ? \n
              Cette action n'impacte pas les données du référentiel ${this.Ref.name}`))
    this.vs.deleteView(viewId).subscribe(() => {
      window.location.reload();
    });
  }

  reloadCurrentRoute(newView: View) {
    let currUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currUrl]).then(() => {
        this.store.dispatch(new SetCurrentView(newView));
      });
    })
  }

  searchColIdToAdd!: string;

  addSearchCol() {
    if (!this.View.searchcolids.includes(this.searchColIdToAdd))
      this.View.searchcolids.push(this.searchColIdToAdd);
  }

  dispColIdToAdd!: string;

  addDispCol() {
    if (!this.View.dispcolids.includes(this.dispColIdToAdd))
      this.View.dispcolids.push(this.dispColIdToAdd);
  }


  SelectView(viewId: string) {                          // TODO : avoid http request, select from ref instead
    console.log("Select ", viewId);
    this.vs.getView(viewId).subscribe((sView) => {        // retrieve previous value of view (unmodified)

      if (this.isInjectionMode)
        this.store.dispatch(new SetInjectionSourceRefView(sView));
      else
        this.store.dispatch(new SetCurrentView(sView));
    });
  }
}


