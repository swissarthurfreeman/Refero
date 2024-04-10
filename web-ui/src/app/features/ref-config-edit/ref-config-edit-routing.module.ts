import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefConfigEditComponent } from './components/routables/ref-config-edit.component';

const routes: Routes = [
  { path: '', component: RefConfigEditComponent } // still manages to read @Input()...!
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefConfigEditRoutingModule { }
