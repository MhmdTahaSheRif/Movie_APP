import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { FilmSearchComponent } from './film-search/film-search.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'signin', component: SigninComponent }, 
  { path: 'signup', component: SignupComponent },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] }, 
  { path: 'movie-details', component: MovieDetailsComponent, canActivate: [AuthGuard] },
  { path: 'filmsearch', component: FilmSearchComponent },
  { path: '**', redirectTo: '/signin', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
