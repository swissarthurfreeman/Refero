import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecEditRoutableComponent } from './components/routables/rec-edit-routable.component';

const routes: Routes = [
  { path: '', component: RecEditRoutableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecEditRoutingModule { }
