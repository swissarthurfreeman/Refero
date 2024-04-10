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

@Component({
  selector: 'app-view-editor',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  templateUrl: './view-editor.component.html'
})
export class ViewEditorComponent {
  constructor(
    private appRef: ApplicationRef
  ) {}
  
  @Input() isInjectionMode: boolean = false;
  @Input() Ref!: Referential;
  
  dataService = inject(RefService);
  
  newViewId = new FormControl('AWESOME_VIEW');

  SaveCurrentView() {
    this.dataService.getRefDataBy(this.Ref.uid).currView.save(this.newViewId.value!);
  }

  SelectView(viewId: string) {
    this.dataService.getRefDataBy(this.Ref.uid).setCurrViewTo(viewId);
    this.Ref = this.dataService.getRefDataBy(this.Ref.uid);  // this ref is shared by search and table, they should update to it changing
    this.appRef.tick();
  }
}


