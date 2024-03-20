import { Component, Inject, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Referential } from '../../model/referential.model';
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './home.component.html',
  providers: []
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router, 
    private route: ActivatedRoute
  ) {}
  
  refs: Referential[] = [];

  ngOnInit(): void {
    this.refs = []
    this.refs.push(new Referential(
      "REF_OFS_NOGA", "Nomenclature des Activités Économiques", "4"))
    this.refs.push(new Referential(
      "REF_UNIGE_REE_DATA_V2", "Registre des Entreprises et Etablissements de l'Unige", "5")
    )
    this.refs.push(new Referential(
      "Default Referential", "Blablablbalalalalalal", "10")
    )
  }

  
  
  selectReferential(refId: string): void {
    //this.contextService.CurrentRefId = refId;
    this.router.navigate([`/${refId}`], {relativeTo: this.route});
  }

  createReferential(): void {
    this.router.navigate([`/create`], {relativeTo: this.route});
  }
}
