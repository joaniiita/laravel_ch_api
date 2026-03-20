import {Component, inject, signal, WritableSignal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Category} from '../../../../models/category';
import {CategoryRow} from '../category-row/category-row';
import {CategoryService} from '../../../../shared/categories/category';
import {NgxPaginationModule} from 'ngx-pagination';

@Component({
  selector: 'app-category-table',
  imports: [
    CategoryRow,
    RouterLink,
    NgxPaginationModule
  ],
  templateUrl: './category-table.html',
  styleUrl: './category-table.css',
})
export class CategoryTable {
  categories = signal<Category[]>([]);
  errorMsg = signal<any>(null);

  page: WritableSignal<number> = signal<number>( 1 );
  pageSize: WritableSignal<number> = signal<number>( 2 );

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
