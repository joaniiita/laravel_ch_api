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

  public currentUser: any | null = null;
  public isLoggedIn = this.auth.isLoggedIn;

  ngOnInit() {
    this.auth.loadUserIfNeeded();
    this.auth.user$.subscribe(user => {
      this.currentUser = user ? user : null;
    });

    console.log(this.currentUser)
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

  getImageUrl(image: string){
    return 'http://localhost:8000/assets/images/user/' + image;
  }
}
