import { ApplicationRef, Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Referential } from '../../../../../shared/models/referential.model';
import { RefService } from '../../../../../shared/services/ref.service';
import { Select, Store } from '@ngxs/store';
import { SetCurrentRef, SetCurrentView } from '../../../../../shared/stores/ref-view/ref-view.action';
import { RefViewState } from '../../../../../shared/stores/ref-view/ref-view.state';
import { Observable } from 'rxjs';
import { View } from '../../../../../shared/models/view.model';
import { CommonModule } from '@angular/common';
import { ViewService } from '../../../../../shared/services/view.service';

@Component({
  selector: 'app-view-editor',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  templateUrl: './view-editor.component.html'
})
export class ViewEditorComponent {
  constructor(
    private appRef: ApplicationRef,
    public vs: ViewService,
    private store: Store
  ) {}
  
  @Input() isInjectionMode: boolean = false;
  @Input() Ref!: Referential;
  
  dataService = inject(RefService);
  
  newViewId = new FormControl('AWESOME_VIEW');

  @Select(RefViewState.getCurrentView) currView$!: Observable<View>;
  
  save(view: View) {
    let newView = view.save(this.newViewId.value!);
    this.vs.registerView(newView);
  }

  SelectView(viewId: string) {
    this.store.dispatch(new SetCurrentView(this.Ref.id, viewId));
    //this.appRef.tick();
  }
}


