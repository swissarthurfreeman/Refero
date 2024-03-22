import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { ViewEditorComponent } from "../view-editor/view-editor.component";
import { SearchComponent } from "../search/search.component";
import { TableComponent } from "../table/table.component";
import { Observable } from 'rxjs';

@Component({
    selector: 'app-consultation',
    standalone: true,
    templateUrl: './consultation.component.html',
    imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule, ViewEditorComponent, SearchComponent, TableComponent]
})
export class ConsultationComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      // Update input properties here
      console.log("Update Params to", params);
      this.config.RefId = params['RefId'];
      this.config.ViewId = params['ViewId'];
      console.log(this.config);
    });
  }

  config: any = { RefId: '', ViewId: ''};

  ngOnInit(): void {
    this.config.RefId = this._refId;
    this.config.ViewId = this._viewId;
    console.log(this.config);
  }
  
  private _refId!: string;
  @Input()                        // this input is able to retrive :refId from url thanks to config in app.routes.ts
  set RefId(refId: string) {      // get the referential ID from the home component
    this._refId = refId;
  }

  get RefId() {
    return this._refId;
  }

  private _viewId!: string; 
  @Input()
  set ViewId(viewId: string) {
    this._viewId = viewId;
  }

  get ViewId(): string {
    return this._viewId;
  }

  simpleView: boolean = false;
  @Input()
  set SimpleView(simpleView: boolean) {
    this.simpleView = simpleView;
  }

  Debug() {
    console.log(this.route.snapshot);
  }
}
