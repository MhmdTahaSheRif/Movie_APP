import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  signIn(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/sign-in`,
      { email, password },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  signUp(email: string, password: string, userName: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/sign-up`,
      { email, password, userName },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input!';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please check your credentials!';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission!';
          break;
        case 404:
          errorMessage = 'Not found. The requested resource is missing!';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later!';
          break;
      }
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
