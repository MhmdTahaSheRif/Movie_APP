import { Component } from '@angular/core';
import { FilmService } from '../film.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';


@Component({
  selector: 'app-film-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './film-search.component.html',
  styleUrls: ['./film-search.component.css']
})
export class FilmSearchComponent {
  films: any[] = [];
  savedFilms = new Set<string>();
  currentPage: number = 1;
  filmsPerPage: number = 18;
  Math = Math;

  constructor(private filmService: FilmService, public dialog: MatDialog) {}

  search(title: string) {
    this.currentPage = 1;
    this.filmService.searchFilms(title).subscribe(
      (response) => {
        if (response.status && response.response.length > 0) {
          this.films = response.response;
        } else {
          this.films = [];
          alert('No films found!');
        }
      },
      (error) => {
        console.error('Search failed:', error);
        alert('Error fetching films.');
      }
    );
  }

  openFilmDetails(film: any) {
    this.dialog.open(MovieDetailsComponent, {
      data: film,
      width: '500px'
    });
  }

  get paginatedFilms() {
    const startIndex = (this.currentPage - 1) * this.filmsPerPage;
    return this.films.slice(startIndex, startIndex + this.filmsPerPage);
  }

  nextPage() {
    if ((this.currentPage * this.filmsPerPage) < this.films.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  saveFilm(imdbId: string) {
    this.filmService.saveFilm(imdbId).subscribe(
      (response) => {
        alert(response.response);
        this.savedFilms.add(imdbId);
      },
      (error) => {
        alert('Failed to save film!');
      }
    );
  }

  removeFilm(filmId: string) {
    this.filmService.removeFilm(filmId).subscribe(
      (response) => {
        alert(response.response);
        this.savedFilms.delete(filmId);
      },
      (error) => {
        alert('Failed to remove film!');
      }
    );
  }

  isFilmSaved(filmId: string): boolean {
    return this.savedFilms.has(filmId);
  }
}
