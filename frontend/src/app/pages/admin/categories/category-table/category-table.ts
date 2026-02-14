import {Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Category} from '../../../../models/category';
import {CategoryRow} from '../category-row/category-row';
import {CategoryService} from '../../../../shared/categories/category';

@Component({
  selector: 'app-category-table',
  imports: [
    CategoryRow,
    RouterLink
  ],
  templateUrl: './category-table.html',
  styleUrl: './category-table.css',
})
export class CategoryTable {
  categories = signal<Category[]>([]);
  errorMsg = signal<any>(null);

  private categoryService = inject(CategoryService);

  constructor() {
  }

  ngOnInit(){
    this.getCategories();
  }

  getCategories(){
    this.categoryService.index().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.log(err)
    })
  }

  deleteCategory(id:number){
    this.categoryService.delete(id).subscribe({
      next: (data) => {
        this.categories.update( categories => categories.filter(category => category.id !== id));
      },
      error: (err) => {
        this.errorMsg.set(Object.values(err.error))
        console.log(err);
      }
    })
  }
}
