import { Component } from '@angular/core';
import { MovieService } from '../movie.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  movies: any[] = [];
  addedMovies = new Set<string>(); 
  currentPage: number = 1;
  moviesPerPage: number = 18;
  Math = Math;

  constructor(private movieService: MovieService, public dialog: MatDialog) {}

  search(title: string) {
    this.currentPage = 1;
    this.movieService.searchMovies(title).subscribe((movies) => {
      if (movies.length > 0) {
        this.movies = movies;
      } else {
        this.movies = [];
      }
    });
  }

  openMovieDetails(movie: any) {
    this.dialog.open(MovieDetailsComponent, {
      data: movie,
      width: '500px'
    });
  }

  get paginatedMovies() {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    return this.movies.slice(startIndex, startIndex + this.moviesPerPage);
  }

  nextPage() {
    if ((this.currentPage * this.moviesPerPage) < this.movies.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  addMovie(imdbId: string) {
    this.movieService.addMovie(imdbId).subscribe(response => {
      alert(response.response); 
      this.addedMovies.add(imdbId); 
    }, error => {
      alert("Failed to add movie!");
    });
  }

  deleteMovie(movieId: string) {
    this.movieService.deleteMovie(movieId).subscribe(response => {
      alert(response.response); 
      this.addedMovies.delete(movieId); 
    }, error => {
      alert("Failed to delete movie!");
    });
  }

  isMovieAdded(movieId: string): boolean {
    return this.addedMovies.has(movieId);
  }
}
export { MovieService };

