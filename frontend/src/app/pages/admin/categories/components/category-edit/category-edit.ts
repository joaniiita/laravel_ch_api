import {Component, inject, signal} from '@angular/core';
import {Category} from '../../../../../models/category';
import {CategoryService} from '../../../../../shared/categories/category';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryForm} from '../category-form/category-form';

@Component({
  selector: 'app-category-edit',
  imports: [
    CategoryForm
  ],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.css',
})
export class AdminCategoryEdit {

  errorMsg = signal<any>(null);
  id = signal<number>(0);
  category = signal<Category>({id: 0, name: ''});

  private aRouter = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  ngOnInit(){
    this.id.set(this.aRouter.snapshot.params['id']);
    this.categoryService.find(this.id()).subscribe({
      next: (data) => this.category.set(data),
      error: (err) => console.log(err)
    })
  }

  handleSave(formData: FormData){
    formData.append('_method', 'PUT');
    this.categoryService.update(this.id(),formData).subscribe({
      next: (data) => {
        this.category.set(data);
        this.router.navigate(['/admin/categories'])
      },
      error: (err) => {
        console.log(err);
        this.errorMsg.set(Object.values(err.error))
      }
    })
  }

}
