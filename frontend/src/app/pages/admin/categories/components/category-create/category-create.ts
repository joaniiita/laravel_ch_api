import {Component, inject, signal} from '@angular/core';
import {PetitionForm} from '../../../petitions/components/petition-form/petition-form';
import {CategoryService} from '../../../../../shared/categories/category';
import {Router} from '@angular/router';
import {CategoryForm} from '../category-form/category-form';

@Component({
  selector: 'app-category-create',
  imports: [
    PetitionForm,
    CategoryForm
  ],
  templateUrl: './category-create.html',
  styleUrl: './category-create.css',
})
export class AdminCategoryCreate {

  errorMsg = signal<any>(null);

  private categoryService = inject(CategoryService);
  private router = inject(Router);

  handleSave(formData: FormData) {
     this.categoryService.create(formData).subscribe({
       next: () => this.router.navigate(['/admin/categories']),
       error: (err) => {
         console.log(err);
         this.errorMsg.set(Object.values(err.error))
       }
     })
  }
}
