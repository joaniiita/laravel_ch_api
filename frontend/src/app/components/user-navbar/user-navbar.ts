import {Component, inject} from '@angular/core';
import {AuthService} from '../../shared/auth/auth';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-user-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './user-navbar.html',
  styleUrl: './user-navbar.css',
  standalone: true
})
export class UserNavbar {

  protected auth = inject(AuthService);
  private router = inject(Router);

  public currentUserRole: boolean | null = null;
  public isLoggedIn = this.auth.isLoggedIn;

  ngOnInit() {
    this.auth.loadUserIfNeeded();
    this.auth.user$.subscribe(user => {
      this.currentUserRole = user ? user.is_admin : null;
    });


  }

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
