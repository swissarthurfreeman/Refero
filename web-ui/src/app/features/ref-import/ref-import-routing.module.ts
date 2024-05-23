import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefImportRoutableComponent } from './components/routables/ref-import-routable.component';

const routes: Routes = [{ path: '', component: RefImportRoutableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportRoutingModule { }
