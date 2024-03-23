import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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
import { RefDataService } from '../../service/ref-data.service';
import { Referential } from '../../model/referential.model';

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
  ) {}

  dataService = inject(RefDataService);
  
  Ref!: Referential; 
  
  ngOnInit(): void {
    this.Ref = this.dataService.getRefDataBy(this.RefUid);
  }
  
  private _RefUid!: string;
  @Input()                        // this input is able to retrive :RefUid from url thanks to config in app.routes.ts
  set RefUid(RefUid: string) {    // get the referential ID from the home component
    this._RefUid = RefUid;
  }

  get RefUid() {
    return this._RefUid;
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
