import {Component, inject, signal} from '@angular/core';
import {CategoryService} from '../../../../../shared/categories/category';
import {ActivatedRoute} from '@angular/router';
import {CategoryForm} from '../category-form/category-form';

@Component({
  selector: 'app-category-show',
  imports: [
    CategoryForm
  ],
  templateUrl: './category-show.html',
  styleUrl: './category-show.css',
})
export class AdminCategoryShow {

  id = signal<number>(0);
  category = signal<any>({});

  private aRouter = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);

  ngOnInit(){
    this.id.set(this.aRouter.snapshot.params['id']);
    this.categoryService.find(this.id()).subscribe({
      next: (data) => this.category.set(data),
      error: (err) => console.log(err)
    })
  }
}
