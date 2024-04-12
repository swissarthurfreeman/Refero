import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { RefService } from '../../shared/services/ref.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  
  constructor(public ds: RefService, public router: Router) {}

  selectReferential(RefId: string) {
    this.router.navigate([`view/${RefId}`]);
  }

  createReferential(): void {
    this.router.navigate([`config`]);
  }
}
