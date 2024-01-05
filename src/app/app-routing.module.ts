import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './shared/pages/landing-page/landing-page.component';

const routes: Routes = [
  { path: 'quiz', component: LandingPageComponent },
  // { path: 'dashboard', component: FavoritesComponent },
  { 
    path: 'dashboard', 
    loadChildren: () => import('../app/shared/pages/dashboard/dashboard.module').then(m => m.DashboardModule), 
  },
  { path: '', redirectTo: 'quiz', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
