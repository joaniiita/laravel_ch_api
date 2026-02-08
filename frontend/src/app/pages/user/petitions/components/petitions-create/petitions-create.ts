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
      category: ['', [Validators.required]],
      image: ['', [Validators.required]],
      }
    );

    this.getCategories();
  }

  onSubmit(){
    if (this.petitionForm.valid) {
      const formData = new FormData();

      // const currentUser = this.auth.getcurrentUserValue();
      //
      // if (!currentUser) {
      //   console.error("No hay usuario cargado. ¿Hiciste login?");
      //   // Opcional: llamar a this.auth.getProfile().subscribe(...) si quieres forzar la carga
      //   return;
      // }

      formData.append('destinatary', this.petitionForm.get('destinatary')?.value);
      formData.append('title', this.petitionForm.get('title')?.value);
      formData.append('description', this.petitionForm.get('description')?.value);
      formData.append('category', this.petitionForm.get('category')?.value);
      // formData.append('user_id', currentUser.id.toString())
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.petitionService.create(formData).subscribe(
        data => {
          this.router.navigate(['/petitions']);
          console.log(data);
        },
        err => {
          this.error = err.error.message;
        }
      );
    } else {
      console.log('Invalid form data');
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
