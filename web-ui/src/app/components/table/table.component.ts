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
import { RefDataService } from '../../service/ref-data.service';
import { Referential } from '../../model/referential.model';

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

  dataService = inject(RefDataService);
  @Input() RefUid!: string;
  // when the view gets swapped the change isn't being detected, for some reason. 
  // the table compontn doesn't call ngOnChanges when a new view is selected, and for some reason
  // when saving a new view, it makes the table white with undefined references all over the place. 
  //@Input() ViewUid!: string;  

  Ref!: Referential;

  viewRecord(uid: string) {
    this.router.navigate([`${uid}`], {relativeTo: this.route})
    console.log(uid); 
  }


  ngOnInit(): void {
    this.Ref = this.dataService.getRefDataBy(this.RefUid);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Table Changes :", changes)
  }
}
