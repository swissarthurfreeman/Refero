import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InjecEditRoutableComponent } from './routables/injec-edit-routable.component';

const routes: Routes = [{ path: '', component: InjecEditRoutableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InjecEditRoutingModule { }
