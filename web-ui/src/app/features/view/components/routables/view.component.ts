import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ConsultRef } from '../../../../shared/stores/ref-view/ref-view.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {
  
  constructor(public store: Store, public router: Router) {}


  @Input() RefId!: string;

  ngOnInit(): void {
    //console.log("ViewRoutable updates store with current ref...");
    this.store.dispatch(new ConsultRef(this.RefId));
  }
}
