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


@Component({
  selector: 'app-table',
  standalone: true,        // TODO : convert to non standalone
  imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, 
    MatDividerModule, MatIconModule, MatGridListModule, MatInputModule],
  styleUrl: './table.component.scss',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit {
  
  
  @Input() simple!: boolean;  // container loads these guys and passes them to the children
  @Input() Ref!: Referential;
  
  constructor(private router: Router, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
  }

  viewRecord(uid: string) {
    this.router.navigate([`record/${this.Ref.uid}/${uid}`]);
  }
}
