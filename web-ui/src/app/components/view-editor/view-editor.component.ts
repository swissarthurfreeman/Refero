import { ApplicationRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RefDataService } from '../../service/ref-data.service';
import { View } from '../../model/view.model';
import { Referential } from '../../model/referential.model';

@Component({
  selector: 'app-view-editor',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  templateUrl: './view-editor.component.html'
})
export class ViewEditorComponent implements OnInit {
  constructor(
    private appRef: ApplicationRef
  ) {}
  
  Ref!: Referential;
  ngOnInit(): void {
    this.Ref = this.dataService.getRefDataBy(this.RefUid);
  }
  
  dataService = inject(RefDataService);
  @Input() RefUid!: string;
  
  newViewId = new FormControl('AWESOME_VIEW');

  SaveCurrentView() {
    this.dataService.getRefDataBy(this.RefUid).currView.save(this.newViewId.value!);
  }

  SelectView(viewId: string) {
    console.log("View Editor Event :", viewId);
    this.dataService.getRefDataBy(this.RefUid).setCurrViewTo(viewId);
    this.Ref = this.dataService.getRefDataBy(this.RefUid);  // this ref is shared by search and table, they should update to it changing
    this.appRef.tick();
  }
}


