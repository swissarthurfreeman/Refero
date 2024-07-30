import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefConfigEditRoutableComponent } from './components/routables/ref-config-edit-routable.component';

const routes: Routes = [
  { path: '', component: RefConfigEditRoutableComponent } // still manages to read @Input()...!
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefConfigEditRoutingModule { }
