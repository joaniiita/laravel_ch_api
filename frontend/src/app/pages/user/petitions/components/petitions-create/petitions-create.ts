import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PetitionService} from '../../../../../shared/petitions/petition';
import {CategoryService} from '../../../../../shared/categories/category';
import {AuthService} from '../../../../../shared/auth/auth';

@Component({
  selector: 'app-petitions-create',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './petitions-create.html',
  styleUrl: './petitions-create.css',
})
export class PetitionsCreate {
  petitionForm!: FormGroup;
  error: any = null;
  selectedFile!: File;
  categories: any[] = [];
  id!: number;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private petitionService = inject(PetitionService);
  private categoryService = inject(CategoryService);
  private auth = inject(AuthService);

  constructor() {
  }

  ngOnInit() {
    this.petitionForm = this.fb.group({
      destinatary: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      image: ['', [Validators.required]],
      }
    );

    this.getCategories();
  }

  onSubmit(){
    if (this.petitionForm.valid) {
      const formData = new FormData();

      formData.append('destinatary', this.petitionForm.get('destinatary')?.value);
      formData.append('title', this.petitionForm.get('title')?.value);
      formData.append('description', this.petitionForm.get('description')?.value);
      formData.append('category_id', this.petitionForm.get('category_id')?.value);
      // formData.append('user_id', currentUser.id.toString())
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.petitionService.create(formData).subscribe(
        data => {
          this.router.navigate(['/petitions']);
          console.log(data);
        },
        err => {
          this.error = err.error;
        }
      );
    } else {
      this.error = 'Faltan campos requeridos por completar.'
      console.log(this.error)
    }

  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
      console.log(this.selectedFile);
    }
  }

  getCategories(){
    this.categoryService.index().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.log(err)
    })
  }
}
