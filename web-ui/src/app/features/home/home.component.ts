import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { RefService } from '../../shared/services/ref.service';
import { Observable } from 'rxjs';
import { Referential } from '../../shared/models/referential.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(public ds: RefService, public router: Router) {}
  
  refs$!: Observable<Referential[]>;
  ngOnInit(): void {
    this.refs$ = this.ds.getReferentials();
  }

  viewReferential(RefId: string) {
    this.router.navigate([`view/${RefId}`]).then(() => {
        window.location.reload();
    });
  }

  createReferential(): void {
    this.router.navigate([`config`])
  }
}
