import {Component, inject, output, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {UserRow} from '../user-row/user-row';
import {AdminPetitionService} from '../../../../shared/petitions/admin/admin-petition';
import {Petition} from '../../../../models/petition';
import {AdminUserService} from '../../../../shared/users/user';
import {User} from '../../../../models/user';

@Component({
  selector: 'app-user-table',
  imports: [
    UserRow,
  ],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css',
})
export class UserTable {
  private adminUserService  = inject(AdminUserService);

  users = signal<User[]>([]);
  onDelete = output<number>()
  constructor() { }

  ngOnInit(){
    this.getUsers();
  }

  getUsers(){
    this.adminUserService.index().subscribe({
      next: (data) => {
        this.users.set(data);
        console.log(data);
      },
      error: (err) => console.log(err)
    })
  }

  deleteUser(id:number){
    this.adminUserService.delete(id).subscribe({
      next: () => {
        this.users.update( data => data.filter(user => user.id !== id))
      },
      error: (err) => console.log(err)
    })
  }

}
