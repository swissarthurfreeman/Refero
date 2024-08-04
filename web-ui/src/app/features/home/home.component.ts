import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RefService} from '../../shared/services/ref.service';
import {Observable} from 'rxjs';
import {Referential} from '../../shared/models/referential.model';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(public ds: RefService, public router: Router, public fb: FormBuilder) {
  }

  dataSource = new MatTableDataSource<Referential>();
  refs$!: Observable<Referential[]>;
  public filterGroup: FormGroup = this.fb.group({
    codeFilterVal: '',
    nameFilterVal: '',
    descFilterVal: ''
  });

  ngOnInit(): void {
    this.refs$ = this.ds.getReferentials();
    this.refs$.subscribe((refs) => {
      this.dataSource.data = refs;
    });

    this.filterGroup.valueChanges.subscribe((filterValue) => {
      this.dataSource.filter = JSON.stringify(filterValue);
      this.filter = filterValue;
    });

    this.dataSource.filterPredicate = this.tableFilter();
  }

  tableFilter(): (data: Referential, filter: string) => boolean {
    let filterFunction = function (data: any, filter: any): boolean {
      let result = true;
      let searchTerms = JSON.parse(filter);
      result = (data.code as string).toLowerCase().indexOf(searchTerms['codeFilterVal'].toLowerCase() as string) != -1 &&
        (data.name as string).toLowerCase().indexOf(searchTerms['nameFilterVal'].toLowerCase() as string) != -1 &&
        (data.description as string).toLowerCase().indexOf(searchTerms['descFilterVal'].toLowerCase() as string) != -1
      return result;
    }
    return filterFunction;
  }

  filter: any = {};

  // TODO : investigate, shouldn't the viewRef / createRef modify the stores or should this
  // be done in the routable of the feature module ?
  viewReferential(refid: string) {
    this.router.navigate([`view/${refid}`]).then(() => {
      window.location.reload();
    });
  }

  createReferential(): void {
    this.router.navigate([`config`])
  }
}
