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
import { Referential } from '../../model/referential.model';
import { v4 as uuidv4 } from 'uuid';

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
  ParentConfig: any = {};
  
  @Input() // TODO : clean this shit up 
  Ref: Referential = new Referential(uuidv4(), '', '', [], {});
  
  viewRecord(uid: string) {
    this.router.navigate([`${uid}`], {relativeTo: this.route})
    console.log(uid); 
  }


  ngOnInit(): void {
    // if no ref was provided, then we're directly accessing by the url, read from there
    console.log(this.Ref)
    if(this.Ref.lines.length == 0) {
      this.Ref = this.dataService.getRefDataBy(this.ParentConfig.RefUid);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ParentConfig = changes['ParentConfig'].currentValue;
  }
}
