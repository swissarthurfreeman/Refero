import { Routes } from '@angular/router';
import { ConsultationComponent } from './components/consultation/consultation.component';
import { HomeComponent } from './components/home/home.component';
import { RecordComponent } from './components/record/record.component';
import { RefCreationComponent } from './components/ref-creation/ref-creation.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'create', component: RefCreationComponent},
    {path: ':RefUid', component: ConsultationComponent}, // Same name as @Inject decorated function, consult ref with ViewId 
    {path: ':RefUid/:RecUid', component: RecordComponent}
];
