import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { Referential } from '../../../../../shared/models/referential.model';
import { Injection } from '../../../../../shared/models/injection.model';
import { Select, Store } from '@ngxs/store';
import { RecEditState } from '../../../../../shared/stores/rec-edit/rec-edit.state';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RefService } from '../../../../../shared/services/ref.service';


@Component({
  selector: 'app-table',
  standalone: true,        // TODO : convert to non standalone
  imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, 
    MatDividerModule, MatIconModule, MatGridListModule, MatInputModule, CommonModule],
  styleUrl: './table.component.scss',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {
  
  
  @Input() simpleMode!: boolean;  // container loads these guys and passes them to the children
  @Input() Ref!: Referential;
  
  constructor(
    private router: Router, 
    public rs: RefService,
    private route: ActivatedRoute, 
    private store: Store) {}
  
  ngOnInit(): void {
  }

  viewRecord(recId: string) {
    this.router.navigate([`record/${this.Ref.uid}/${recId}`]);
  }
  
  @Select(RecEditState.getDestRecId) DestRecId$!: Observable<string>;
  @Select(RecEditState.getDestRef) DestRef$!: Observable<Referential>;
  @Select(RecEditState.getInjection) Injection$!: Observable<Injection>;

  applyInjection(srcRecId: string, destRecId: string, Injection: Injection) {
    let SrcRec = this.Ref.getRecordById(srcRecId);
    
    let DestRef = this.rs.getRefDataBy(Injection.destId);
    let DestRec = DestRef.getRecordById(destRecId);

    let result = Injection.apply(SrcRec, DestRec)
    
    DestRef.setRecordById(result);
  } 
}
