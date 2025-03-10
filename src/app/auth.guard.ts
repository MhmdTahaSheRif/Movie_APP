import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (state.url === '/signin' || state.url === '/signup') {
      return true;
    }

    if (token) {
      return true; 
    } else {
      this.router.navigate(['/signin']); 
      return false; 
    }
  }
}
