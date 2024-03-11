import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './consultation.component.html'
})
export class ConsultationComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}
  refId: string | undefined;
  
  
  myDataArray: Array<Object> = [
    {'uid': 2375, 'REE_N_OFS': 102855, 'REE_NOM': "Unige CMU", 'C_ALPHA_NEW': 'UNACI', 'ADRESSE': 'Rue des Bains 26'},
    {'uid': 4096, 'REE_N_OFS': 102868, 'REE_NOM': "Faculté des Sciences", 'C_ALPHA_NEW': 'S', 'ADRESSE': 'Quai Ernest Ansermet 32'},
    {'uid': 2404, 'REE_N_OFS': 103225, 'REE_NOM': "Unige FSS", 'C_ALPHA_NEW': 'UNACI', 'ADRESSE': 'Rue de Montbrilland 64'}
  ];


  
  columns = ['REE_N_OFS', 'REE_NOM', 'C_ALPHA_NEW', 'ADRESSE']
  viewColumnsToDisplay = ['REE_N_OFS', 'REE_NOM'];    // can add 'C_ALPHA_NEW' to view it too
  nonViewedColumns: Array<string> = this.columns.filter(item => this.viewColumnsToDisplay.indexOf(item) < 0);
  viewColumnToAdd = this.nonViewedColumns[0];
  
  searchColumns = ['REE_N_OFS']
  nonAddedSearchColumns: Array<string> = this.columns.filter(item => this.searchColumns.indexOf(item) < 0);
  searchFieldToAdd = this.searchColumns[0];



  @Input()        
  set RefId(refId: string) {      // get the referential ID from the home component
    this.refId = refId;
  }

  viewRecord(uid: string) {
    this.router.navigate([`${uid}`], {relativeTo: this.route})
    console.log(uid); 
  }

  addSearchField(column: string) {
    this.searchColumns.push(column)
    this.nonAddedSearchColumns = this.columns.filter(item => this.searchColumns.indexOf(item) < 0);
  }

  addViewColumn(column: string) {
    this.viewColumnsToDisplay.push(column);
    this.nonViewedColumns = this.columns.filter(item => this.viewColumnsToDisplay.indexOf(item) < 0);
  }

  removeViewColumn(column: string) {
    this.viewColumnsToDisplay = this.viewColumnsToDisplay.filter(item => item != column);
  }
}
