import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { RefViewService } from '../../service/ref-view.service';
import { RefDataService } from '../../service/ref-data.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, 
    MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {
  
  simpleView: boolean = false;
  
  constructor(private router: Router, private route: ActivatedRoute) {}

  viewService = inject(RefViewService);

  dataService = inject(RefDataService);

  @Input()
  ParentConfig: any;
  
  viewRecord(uid: string) {
    this.router.navigate([`${uid}`], {relativeTo: this.route})
    console.log(uid); 
  }


  ngOnInit(): void {
    console.log("Table Params", this.ParentConfig.RefId, this.ParentConfig.ViewId);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Table detected change");
    this.ParentConfig = changes['ParentConfig'].currentValue;
    console.log(changes);     
  }
}
