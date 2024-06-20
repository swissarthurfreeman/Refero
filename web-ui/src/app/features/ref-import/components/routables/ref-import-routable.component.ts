import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { RefService } from '../../../../shared/services/ref.service';
import { Referential } from '../../../../shared/models/referential.model';


@Component({
  selector: 'app-ref-import-routable',
  templateUrl: './ref-import-routable.component.html',
})
export class RefImportRoutableComponent implements OnInit {
  constructor(private rs: RefService) {}
  
  @Input() refid!: string;
  
  ngOnInit(): void {
    this.ref$ = this.rs.getReferentialBy(this.refid);
  }
  
  ref$!: Observable<Referential>;

}
