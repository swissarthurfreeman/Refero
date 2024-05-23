import { Component, Input, OnInit } from '@angular/core';
import { RefViewState } from '../../../../shared/stores/ref-view/ref-view.state';
import { Observable } from 'rxjs';
import { Referential } from '../../../../shared/models/referential.model';
import { Select } from '@ngxs/store';
import { RefService } from '../../../../shared/services/ref.service';

@Component({
  selector: 'app-ref-import-routable',
  templateUrl: './ref-import-routable.component.html',
})
export class RefImportRoutableComponent implements OnInit {
  constructor(private rs: RefService) {}
  
  @Input() RefId!: string;
  
  ngOnInit(): void {
    this.ref$ = this.rs.getReferentialBy(this.RefId);
  }
  
  ref$!: Observable<Referential>;

}
