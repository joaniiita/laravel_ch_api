import {Component, input, Input, output} from '@angular/core';
import {Petition} from '../../../../models/petition';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'tr[app-petition-row]',
  imports: [
    RouterLink
  ],
  templateUrl: './petition-row.html',
  styleUrl: './petition-row.css',
  standalone: true
})
export class PetitionRow {
  petition = input.required<Petition>();

  onDelete = output<number>();

  onChangeStatus = output<Petition>();


  getUrl(image : string){
    return 'http://localhost:8000/storage/assets/images/petitions/' + image;
  }
}
