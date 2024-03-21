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


@Component({
    selector: 'app-consultation',
    standalone: true,
    templateUrl: './consultation.component.html',
    imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule, MatGridListModule, MatInputModule, ViewEditorComponent, SearchComponent, TableComponent]
})
export class ConsultationComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  /*refId: string | undefined;
  @Input()                        // this input is able to retrive :refId from url thanks to config in app.routes.ts
  set RefId(refId: string) {      // get the referential ID from the home component
    this.refId = refId;
  } */
  RefId = 'REF_OFS_REE_DATA'; 
  
  simpleView: boolean = false;
  @Input()
  set SimpleView(simpleView: boolean) {
    this.simpleView = simpleView;
  }
}
