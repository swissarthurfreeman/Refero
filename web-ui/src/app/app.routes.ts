import { Routes } from '@angular/router';
import { ConsultationComponent } from './components/consultation/consultation.component';
import { HomeComponent } from './components/home/home.component';
import { RecordComponent } from './components/record/record.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: ':RefId', component: ConsultationComponent}, // must have same name as @Inject decorated function
    {path: ':RefId/:RecId', component: RecordComponent}
];
