import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private omdbApiUrl = 'https://www.omdbapi.com/';
  private backendApiUrl = 'http://localhost:8080/api/movie'; 
  private apiKey = 'b0223e15';

  constructor(private http: HttpClient) {}

  searchMovies(title: string): Observable<any[]> {
    const formattedTitle = title.trim().replace(/\s+/g, '+');

    return this.http.get<any>(`${this.omdbApiUrl}?s=${formattedTitle}&apikey=${this.apiKey}`).pipe(
      switchMap(response => {
        if (response.Response === 'True') {
          const totalResults = parseInt(response.totalResults, 10);
          const totalPages = Math.ceil(totalResults / 10);

          const requests: Observable<any>[] = [];
          for (let page = 2; page <= totalPages; page++) {
            requests.push(this.http.get<any>(`${this.omdbApiUrl}?s=${formattedTitle}&apikey=${this.apiKey}&page=${page}`));
          }

          return requests.length > 0 
            ? forkJoin(requests).pipe(
                map(responses => response.Search.concat(...responses.map(res => res.Search || [])))
              )
            : of(response.Search);
        } else {
          return of([]);
        }
      }),
      catchError(() => of([])) 
    );
  }

  // Fetch movie details from OMDb API
  getMovieDetails(imdbID: string): Observable<any> {
    return this.http.get(`${this.omdbApiUrl}?i=${imdbID}&apikey=${this.apiKey}`).pipe(
      catchError(() => of({ error: 'Movie not found' }))
    );
  }

  addMovie(imdbId: string): Observable<any> {
    return this.http.post<any>(`${this.backendApiUrl}/add`, { imdbId }, { headers: this.getHeaders() }).pipe(
      catchError(() => of({ error: 'Failed to add movie' }))
    );
  }

  // ✅ Fix: Delete Movie from Your Backend Database
  deleteMovie(movieId: string): Observable<any> {
    return this.http.delete<any>(`${this.backendApiUrl}/remove/${movieId}`, { headers: this.getHeaders() }).pipe(
      catchError(() => of({ error: 'Failed to delete movie' }))
    );
  }

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
}
