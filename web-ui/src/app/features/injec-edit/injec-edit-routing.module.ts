import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InjecEditComponent } from './routables/injec-edit.component';

const routes: Routes = [{ path: '', component: InjecEditComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InjecEditRoutingModule { }
