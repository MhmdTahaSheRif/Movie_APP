import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password).subscribe(
        response => {
          console.log('API Response:', response);
  
          if (response && response.response && response.response.token) {
            localStorage.setItem('token', response.response.token);
            console.log('Login successful');
            this.router.navigate(['/search']); 
          } else {
            this.errorMessage = 'Invalid login credentials';
            console.error('Login failed: Invalid response structure');
          }
        },
        error => {
          this.errorMessage = 'Login failed. Please try again.';
          console.error('Login failed:', error);
        }
      );
    }
  }
  
}
