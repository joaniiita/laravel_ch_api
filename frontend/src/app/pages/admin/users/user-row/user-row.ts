import {Component, input, output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Petition} from '../../../../models/petition';
import {User} from '../../../../models/user';

@Component({
  selector: 'tr[app-user-row]',
  imports: [
    RouterLink
  ],
  templateUrl: './user-row.html',
  styleUrl: './user-row.css',
})
export class UserRow {
  user = input.required<User>();

  onDelete = output<number>();

  onChangeStatus = output<User>();


  getUrl(image : string){
    return 'http://localhost:8000/assets/images/user/' + image;
  }
}
