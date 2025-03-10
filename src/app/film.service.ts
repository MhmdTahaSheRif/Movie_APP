import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private apiUrl = 'http://localhost:8080/api/film';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {

    // tokeeeeeeen
    const token = localStorage.getItem('token'); 
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  searchFilms(title: string, year?: string, director?: string): Observable<any> {
    let params = new HttpParams().set('title', title);
    if (year) params = params.set('year', year);
    if (director) params = params.set('director', director);

    return this.http.get(`${this.apiUrl}/search`, { headers: this.getAuthHeaders(), params });
  }

  saveFilm(imdbId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, { imdbId }, { headers: this.getAuthHeaders() });
  }

  removeFilm(filmId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${filmId}`, { headers: this.getAuthHeaders() });
  }
}
