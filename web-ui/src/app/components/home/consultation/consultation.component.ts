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
  myDataArray: Array<Object>;     // table data
  cols: Array<string>;            // all columns in the referential
  dispCols: Array<string>;        // active table columns, e.g. displayed on screen
  nDispCols: Array<string>;       // inactive table columns, e.g. not displayed on screen
  dispAddOpt: string;             // 'Add Column' select field value binding

  searchCols: Array<string>;      // active search fields
  nSearchCols: Array<string>;     // unactive search fields
  searchAddOpt: string;           // 'Add Search' select field value binding
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.myDataArray = [
      {'uid': 2375, 'REE_N_OFS': 102855, 'REE_NOM': "Unige CMU", 'C_ALPHA_NEW': 'UNACI', 'ADRESSE': 'Rue des Bains 26'},
      {'uid': 4096, 'REE_N_OFS': 102868, 'REE_NOM': "Faculté des Sciences", 'C_ALPHA_NEW': 'S', 'ADRESSE': 'Quai Ernest Ansermet 32'},
      {'uid': 2404, 'REE_N_OFS': 103225, 'REE_NOM': "Unige FSS", 'C_ALPHA_NEW': 'UNACI', 'ADRESSE': 'Rue de Montbrilland 64'}
    ];

    this.cols = ['REE_N_OFS', 'REE_NOM', 'C_ALPHA_NEW', 'ADRESSE']
    this.dispCols = ['REE_N_OFS', 'REE_NOM'];  // can add 'C_ALPHA_NEW' to view it too    
    
    // filter columns not already visible
    this.nDispCols = this.difference(this.cols, this.dispCols) 
    this.dispAddOpt = this.nDispCols[0];
    
    this.searchCols = ['REE_N_OFS'];

    this.nSearchCols = this.difference(this.cols, this.searchCols);
    this.searchAddOpt = this.nSearchCols[0];

  }
  
  refId: string | undefined;
  @Input()        
  set RefId(refId: string) {      // get the referential ID from the home component
    this.refId = refId;
  }  

  difference(arr1: Array<string>, arr2: Array<string>): Array<string> {
    return arr1.filter(item => arr2.indexOf(item) < 0);
  }

  viewRecord(uid: string) {
    this.router.navigate([`${uid}`], {relativeTo: this.route})
    console.log(uid); 
  }

  addSearchField(column: string) {
    this.searchCols.push(column)
    this.nSearchCols = this.difference(this.cols, this.searchCols);
  }

  addViewColumn(column: string) {
    this.dispCols.push(column);
    this.nDispCols = this.difference(this.cols, this.dispCols);
  }

  removeViewColumn(column: string) {
    this.dispCols = this.dispCols.filter(item => item != column);
    this.nDispCols.push(column);
  }

  removeSearchField(column: string) {
    this.searchCols = this.searchCols.filter(item => item != column);
    this.nSearchCols.push(column);
  }
}
