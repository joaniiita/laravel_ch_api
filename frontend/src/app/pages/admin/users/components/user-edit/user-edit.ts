import {Component, inject, signal} from '@angular/core';
import {CategoryForm} from '../../../categories/components/category-form/category-form';
import {Category} from '../../../../../models/category';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../../../../shared/categories/category';
import {AdminUserService} from '../../../../../shared/users/user';
import {UserForm} from '../user-form/user-form';

@Component({
  selector: 'app-user-edit',
  imports: [
    UserForm
  ],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css',
})
export class AdminUserEdit {
  errorMsg = signal<any>(null);
  id = signal<number>(0);
  user = signal<any>({});

  private aRouter = inject(ActivatedRoute);
  private adminUserService = inject(AdminUserService);
  private router = inject(Router);

  ngOnInit(){
    this.id.set(this.aRouter.snapshot.params['id']);
    this.adminUserService.find(this.id()).subscribe({
      next: (data) => this.user.set(data),
      error: (err) => console.log(err)
    })
  }

  handleSave(formData: FormData){
    formData.append('_method', 'PUT');
    this.adminUserService.update(this.id(),formData).subscribe({
      next: (data) => {
        this.user.set(data);
        this.router.navigate(['/admin/users'])
      },
      error: (err) => {
        console.log(err);
        this.errorMsg.set(Object.values(err.error))
      }
    })
  }

}
