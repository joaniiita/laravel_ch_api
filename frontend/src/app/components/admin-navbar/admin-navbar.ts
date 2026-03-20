import {Component, effect, inject} from '@angular/core';
import {AuthService} from '../../shared/auth/auth';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {Search} from '../../shared/petitions/admin/search';

@Component({
  selector: 'app-admin-navbar',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css',
  standalone: true
})
export class AdminNavbar {

  private auth = inject(AuthService);
  private router = inject(Router);
  protected searchService = inject(Search);

  protected currentUser : any | null = null;

  ngOnInit() {
    this.auth.loadUserIfNeeded();
    this.auth.user$.subscribe(user => {
      this.currentUser = user;
    });
  }



  logout(){
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

  getUrl(image: string){
    return 'http://localhost:8000/assets/images/user/' + image;
  }
}
