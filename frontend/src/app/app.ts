import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {Footer} from './components/footer/footer';
import {CommonModule} from '@angular/common';
import {AuthService} from './shared/auth/auth';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  protected auth = inject(AuthService);
  private router = inject(Router);

  public isLoggedIn = this.auth.isLoggedIn;
  public currentUser = this.auth.currentUser;

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
      },
      complete: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
