import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import { RefViewService } from '../../service/ref-view.service';
import { Location } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-view-editor',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  templateUrl: './view-editor.component.html'
})
export class ViewEditorComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    console.log("ViewEditorComponent", this.ParentConfig);
  }
  viewService = inject(RefViewService);

  @Input() ParentConfig: any;
  
  newViewId = new FormControl('AWESOME_VIEW');

  SaveCurrentView() {
    this.viewService.saveVisibleViewAs(
      this.ParentConfig.RefId, 
      this.ParentConfig.ViewId, 
      this.newViewId.value!
    );
  }

  SelectView(viewId: any) {
    const qp : Params = {'RefId': this.ParentConfig.RefId, 'ViewId': viewId}; 
    this.router.navigate([this.ParentConfig.RefId, viewId], 
      qp
    );
  }
}


