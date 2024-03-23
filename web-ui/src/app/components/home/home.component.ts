import { Component, Inject, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Referential } from '../../model/referential.model';
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button';
import { RefDataService } from '../../service/ref-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './home.component.html',
  providers: []
})
export class HomeComponent {
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    public ds: RefDataService
  ) {}
  
  selectReferential(RefUid: string): void {
    this.router.navigate([`${RefUid}`], {relativeTo: this.route});
  }

  createReferential(): void {
    this.router.navigate([`/create`], {relativeTo: this.route});
  }
}
