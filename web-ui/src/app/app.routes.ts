import { Routes } from '@angular/router';
import { ConsultationComponent } from './components/consultation/consultation.component';
import { HomeComponent } from './components/home/home.component';
import { RecordComponent } from './components/record/record.component';
import { RefEditComponent } from './components/ref-edit/ref-edit.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'create', component: RefEditComponent},
    {path: ':RefUid', component: ConsultationComponent}, // Same name as @Inject decorated function, consult ref with ViewId 
    {path: ':RefUid/:RecUid', component: RecordComponent}
];
