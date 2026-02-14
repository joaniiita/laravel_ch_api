import {Component, input, output} from '@angular/core';
import {Category} from '../../../../models/category';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'tr[app-category-row]',
  imports: [
    RouterLink
  ],
  templateUrl: './category-row.html',
  styleUrl: './category-row.css',
})
export class CategoryRow {
  category = input.required<Category>()

  onDelete = output<number>();

}
