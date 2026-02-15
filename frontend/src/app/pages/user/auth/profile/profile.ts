import {Component, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {AuthService} from '../../../../shared/auth/auth';
import {Router, RouterLink} from '@angular/router';
import {Petition} from '../../../../models/petition';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  currentUser : any | null = null;


  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe(user => this.currentUser = user);
    this.auth.loadUserIfNeeded();
  }

  petitions_count = computed(() => {
    return this.currentUser?.petitions?.length ?? 0;
  });

  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }

  getImageUrl(image: string){
    return 'http://localhost:8000/assets/images/user/' + image;
  }

}
