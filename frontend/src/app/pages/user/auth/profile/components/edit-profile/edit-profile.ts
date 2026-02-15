import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../../../shared/auth/auth';
import {FormsModule} from '@angular/forms';
import {AdminUserService} from '../../../../../../shared/users/user';

@Component({
  selector: 'app-edit-profile',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
    currentUser : any | null = null;
    id = signal<number>(0);
    petition = signal<any>({});

    private auth = inject(AuthService);
    private router = inject(Router);
    private aRouter = inject(ActivatedRoute);
    private userService = inject(AdminUserService);

    ngOnInit(){
      this.auth.loadUserIfNeeded();
      this.auth.user$.subscribe(
        user => this.currentUser = user
      )

      this.id.set(this.aRouter.snapshot.params['id']);
      this.userService.find(this.id()).subscribe({
        next: (data) => this.petition.set(data),
        error: (err) => console.log(err)
      })
    }

    updateUser(){
      this.userService.update(this.id(), this.petition()).subscribe({
        next: () => this.router.navigate(['/user/profile']),
        error: (err) => console.log(err)
      })
    }

    getImageUrl(image: string){
      return 'http://localhost:8000/assets/images/user/' + image;
    }
}
