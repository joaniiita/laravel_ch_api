import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {AuthService} from '../../../../shared/auth/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user$!: Observable<any>;
  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.user$;
    this.auth.getProfile().subscribe();
  }
  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }

}
