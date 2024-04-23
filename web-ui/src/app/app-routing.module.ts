import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },  
  { path: 'view', loadChildren: () => import('./features/view/view.module').then(m => m.ViewModule) },
  { path: 'entry/:RefId/:RecId', loadChildren: () => import('./features/rec-edit/rec-edit.module').then(m => m.RecEditModule) },
  { path: 'config/:RefId/injections', loadChildren: () => import('./features/injec-edit/injec-edit.module').then(m => m.InjecEditModule) },
  { path: 'config/:RefId', loadChildren: () => import('./features/ref-edit/ref-config-edit.module').then(m => m.RefConfigEditModule) },
  { path: 'config', loadChildren: () => import('./features/ref-edit/ref-config-edit.module').then(m => m.RefConfigEditModule) },
  //{ path: 'import/:RefId', loadChildren: () => import('./features/import/import.module').then(m => m.ImportModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
