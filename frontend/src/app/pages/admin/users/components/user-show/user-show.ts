import {Component, inject, signal} from '@angular/core';
import {UserForm} from '../user-form/user-form';
import {ActivatedRoute} from '@angular/router';
import {AdminUserService} from '../../../../../shared/users/user';

@Component({
  selector: 'app-user-show',
  imports: [
    UserForm
  ],
  templateUrl: './user-show.html',
  styleUrl: './user-show.css',
})
export class AdminUserShow {
  user = signal<any>({});
  id = signal<number>(0);

  private aRouter = inject(ActivatedRoute);
  private adminUserService = inject(AdminUserService);

  ngOnInit(){
    this.id.set(this.aRouter.snapshot.params['id']);
    this.adminUserService.find(this.id()).subscribe({
      next: (data) => this.user.set(data),
      error: (err) => console.log(err)
    })
    console.log(this.user(), this.id());
  }
}
